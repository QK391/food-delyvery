import express from "express";
import {loginUser, registerUser, getUserProfile, updateUserProfile, updatePassword} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router()
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/profile", authMiddleware, getUserProfile)
userRouter.put("/profile", authMiddleware, updateUserProfile)
userRouter.put("/password", authMiddleware, updatePassword)

export default userRouter;