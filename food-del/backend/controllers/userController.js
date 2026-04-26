import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login
const loginUser = async(req,res) => {
    const {email, password}= req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message: "User doesn't exist"})
        }
        if (user.isBlocked) {
            return res.json({ success: false, message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ." });
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false, message: "Invalid credentails"})
        }
        const token = createToken(user._id);
        res.json({success:true, token})
    }catch(error){
        console.log(error);
        res.json({success:false,message:""})
    }
}
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}
//register user
const registerUser = async(req,res) => {
    const {name, password, email} = req.body;
    try{ //checking is user alread
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message: "User alrealy exists"})
        }
        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"})
        }
        if (password.length < 8){
            return res.json({success:false, message:"Please enter a strong password"})
        }
        //hashing user
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success: true, token})
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    };
}
// get user profile
const getUserProfile = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                defaultAddress: user.defaultAddress || null,
            },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
};

// update user profile
const updateUserProfile = async (req, res) => {
    const { userId, name, email, defaultAddress } = req.body;
    try {
        const updateFields = {};

        if (name !== undefined) {
            if (!name || !name.trim()) {
                return res.json({ success: false, message: "Tên không được để trống" });
            }
            updateFields.name = name.trim();
        }

        if (email !== undefined) {
            if (!validator.isEmail(email)) {
                return res.json({ success: false, message: "Email không hợp lệ" });
            }
            const existing = await userModel.findOne({ email, _id: { $ne: userId } });
            if (existing) {
                return res.json({ success: false, message: "Email đã được sử dụng" });
            }
            updateFields.email = email;
        }

        if (defaultAddress !== undefined) {
            const required = ["street", "city", "country"];
            const missing = required.filter((f) => !defaultAddress[f] || !defaultAddress[f].trim());
            if (missing.length > 0) {
                return res.json({ success: false, message: `Thiếu các trường: ${missing.join(", ")}` });
            }
            updateFields.defaultAddress = defaultAddress;
        }

        const user = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                defaultAddress: user.defaultAddress || null,
            },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
};

// update password
const updatePassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Mật khẩu hiện tại không đúng" });
        }

        if (!newPassword || newPassword.length < 8) {
            return res.json({ success: false, message: "Mật khẩu phải có ít nhất 8 ký tự" });
        }

        if (newPassword === currentPassword) {
            return res.json({ success: false, message: "Mật khẩu mới phải khác mật khẩu hiện tại" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
};

// list all users (admin)
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).sort({ _id: -1 }).select("-password -cartData");
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
};

// block user (admin)
const blockUser = async (req, res) => {
    const { userId } = req.body;
    try {
        await userModel.findByIdAndUpdate(userId, { isBlocked: true });
        res.json({ success: true, message: "Da khoa tai khoan" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
};

// unblock user (admin)
const unblockUser = async (req, res) => {
    const { userId } = req.body;
    try {
        await userModel.findByIdAndUpdate(userId, { isBlocked: false });
        res.json({ success: true, message: "Da mo khoa tai khoan" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
};

export { loginUser, registerUser, getUserProfile, updateUserProfile, updatePassword, listUsers, blockUser, unblockUser }