import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
})
const TodoModel = mongoose.model('Todo', todoSchema);
export default TodoModel;