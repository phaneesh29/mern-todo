import { validationResult } from "express-validator";
import { sendEmail } from "../helpers/mailer.js";
import UserModel from "../models/user.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";


export const registerController = async (req, res) => {
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

export const verifyEmailContoller = async (req, res) => {
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
}

export const loginContoller = async (req, res) => {
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

export const forgotPasswordController = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
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
        return res.status(500).json({ message: error.message })
    }
}

export const changePasswordController = async (req, res) => {
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
}

export const profileController = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logoutController = async (req, res) => {
    try {
        res.clearCookie("token")
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
        await blacklistTokenModel.create({ token })
        res.status(200).json({ message: 'Logged out' })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
