import TodoModel from "../models/todo.model.js";


export const getAuthUserTodo = async (req, res) => {
    const user_todo = req.user
    if (!user_todo) {
        return res.status(404).json({ message: "User not found" });
    }
    const user_id = user_todo._id
    try {
        const todos = await TodoModel.find({ user: user_id }).sort({ completed: 1 })
        if (!todos || todos.length === 0) {
            return res.status(404).json({ message: "No todos found" });
        }
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const postAuthUserTodo = async (req, res) => {
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
}

export const updateAuthUserTodo = async (req, res) => {
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
}

export const deleteAuthUserTodo = async (req, res) => {
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
}
