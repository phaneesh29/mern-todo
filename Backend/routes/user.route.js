import { Router } from "express";
import { changePasswordController, forgotPasswordController, loginContoller, logoutController, profileController, registerController, verifyEmailContoller } from "../controllers/user.controller.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.post("/register", [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("fullname.firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], registerController
)

userRouter.post("/verifyemail", verifyEmailContoller)

userRouter.post("/login", [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], loginContoller
)

userRouter.post("/forgot", [
    body("email").isEmail().withMessage("Enter a valid email"),
], forgotPasswordController)

userRouter.post("/changepassword", changePasswordController)

userRouter.get("/profile", authUser, profileController)

userRouter.get("/logout", authUser, logoutController)

export default userRouter