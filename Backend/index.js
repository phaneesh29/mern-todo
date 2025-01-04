import "dotenv/config"
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./db/db.config.js"
import { body, validationResult } from "express-validator";
import UserModel from "./models/user.model.js";
import { authUser } from "./middlewares/auth.middleware.js";
import blacklistTokenModel from "./models/blacklistToken.model.js";
import TodoModel from "./models/todo.model.js";
import { sendEmail } from "./helpers/mailer.js";

connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.post("/register", [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("fullname.firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const { fullname, email, password } = req.body

            if (!fullname || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });

            }
            const isUserAlreadyExist = await UserModel.findOne({ email })

            if (isUserAlreadyExist) {
                return res.status(400).json({ message: 'User already exist' });
            }
            const hashedPassword = await UserModel.hashPassword(password)
            const user = await UserModel.create({
                fullname: {
                    firstname: fullname.firstname,
                    lastname: fullname.lastname
                },
                email,
                password: hashedPassword
            })

            await sendEmail({ email, emailType: "VERIFY", userId: user._id })

            res.status(201).json({
                message: "User created, check your email to verify account",
                success: true,
                user
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    }
)

app.post("/verifyemail", async (req, res) => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }

        const user = await UserModel.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return res.status(400).json({ error: "Invalid token" })
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined
        await user.save()

        return res.status(200).json({ message: "Email verified successfully", success: true })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

app.post("/login", [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { email, password } = req.body
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });

            }

            const user = await UserModel.findOne({ email }).select("+password")
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = await user.comparePassword(password)
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            if (!user.isVerified) {
                await sendEmail({ email, emailType: "VERIFY", userId: user._id })
                return res.status(401).json({ message: 'User not verified, Email sent again' });
            }

            const token = user.genrateAuthToken()

            res.cookie("token", token)

            res.status(200).json({ message: "Login Successfull", token, user })
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
)

app.post("/forgot", async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await sendEmail({ email, emailType: "FORGOT", userId: user._id })

        return res.status(200).json({ message: "Email sent successfully" })

    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
})

app.post("/changepassword", async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body

        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match" })
        }

        const user = await UserModel.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return res.status(400).json({ error: "Invalid token" })
        }

        const hashedPassword = await UserModel.hashPassword(password)
        user.password = hashedPassword
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined
        await user.save()

        return res.status(200).json({ message: "Password changed successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

app.get("/profile", authUser, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.get("/logout", authUser, async (req, res, next) => {
    res.clearCookie("token")
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    await blacklistTokenModel.create({ token })
    res.status(200).json({ message: 'Logged out' })
})

app.get("/user/todos", authUser, async (req, res) => {
    const user_todo = req.user
    if (!user_todo) {
        return res.status(404).json({ message: "User not found" });
    }
    const user_id = user_todo._id
    try {
        const todos = await TodoModel.find({ user: user_id })
        if (!todos || todos.length === 0) {
            return res.status(404).json({ message: "No todos found" });
        }
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

app.post("/user/todos", authUser, async (req, res) => {
    const user_todo = req.user
    if (!user_todo) {
        return res.status(404).json({ message: "User not found" });
    }
    const user_id = user_todo._id
    const { title, description } = req.body
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    try {
        const todos = await TodoModel.create({
            title,
            description,
            user: user_id
        })
        res.status(201).json(todos)

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
})

app.put("/user/todos/:id", authUser, async (req, res) => {
    const { id: todoId } = req.params;
    try {
        const todo = await TodoModel.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        todo.completed = !todo.completed;
        await todo.save();
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

app.delete("/user/todos/:id", authUser, async (req, res) => {
    const { id: todoId } = req.params;
    try {
        const todo = await TodoModel.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        await TodoModel.deleteOne({ _id: todoId });
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
})

app.get("/users/:id", async (req, res) => {
    const { id: userId } = req.params
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const todos = await TodoModel.find({ user: userId })
        res.status(200).json({ user, todos })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})


app.get("/health", (req, res) => {
    res.status(200).json({
        "message": "Server Running",
        timestamp: new Date(),
    })
})




app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
})