import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { deleteAuthUserTodo, getAuthUserTodo, postAuthUserTodo, updateAuthUserTodo } from "../controllers/todo.controller.js";

const todoRouter = Router()

todoRouter.get("/todos", authUser, getAuthUserTodo)

todoRouter.post("/todos", authUser, postAuthUserTodo)

todoRouter.put("/todos/:id", authUser, updateAuthUserTodo)

todoRouter.delete("/todos/:id", authUser, deleteAuthUserTodo)





export default todoRouter