import TodoModel from "../models/todo.model.js";
import UserModel from "../models/user.model.js";

export const getTodosByUserIdController = async (req, res) => {
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
}