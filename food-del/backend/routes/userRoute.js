import express from "express";
import {loginUser, registerUser, getUserProfile, updateUserProfile, updatePassword, listUsers, blockUser, unblockUser, forgotPassword, resetPassword} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router()
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/profile", authMiddleware, getUserProfile)
userRouter.put("/profile", authMiddleware, updateUserProfile)
userRouter.put("/password", authMiddleware, updatePassword)
userRouter.get("/list", listUsers)
userRouter.post("/block", blockUser)
userRouter.post("/unblock", unblockUser)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password", resetPassword)

// Admin login
userRouter.post("/admin-login", (req, res) => {
    const { username, password } = req.body;
    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return res.json({ success: true, message: "Dang nhap thanh cong" });
    }
    return res.json({ success: false, message: "Sai ten dang nhap hoac mat khau" });
});

// Admin change password
userRouter.post("/admin-change-password", (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.json({ success: false, message: "Vui long nhap day du thong tin" });
    }
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
        return res.json({ success: false, message: "Mat khau hien tai khong dung" });
    }
    if (newPassword.length < 6) {
        return res.json({ success: false, message: "Mat khau moi phai co it nhat 6 ky tu" });
    }
    // Update runtime password (effective until server restart)
    process.env.ADMIN_PASSWORD = newPassword;
    return res.json({ success: true, message: "Doi mat khau thanh cong. Vui long cap nhat file .env de luu vinh vien." });
});

export default userRouter;