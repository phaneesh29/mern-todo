import { Router } from "express";
import { getTodosByUserIdController } from "../controllers/id.controller.js";

const idRouter = Router()

idRouter.get("/users/:id",getTodosByUserIdController)

export default idRouter