import "dotenv/config"
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./db/db.config.js"
import userRouter from "./routes/user.route.js";
import idRouter from "./routes/id.route.js";
import todoRouter from "./routes/todo.route.js";

connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use("/users", userRouter)
app.use("/id", idRouter)
app.use("/task", todoRouter)

app.get("/health", (req, res) => {
    res.status(200).json({
        "message": "Server Running",
        timestamp: new Date(),
    })
})


app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
})