import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    cartData:{type: Object, default: {}},
    defaultAddress: {
        street:  { type: String, default: "" },
        city:    { type: String, default: "" },
        state:   { type: String, default: "" },
        zipcode: { type: String, default: "" },
        country: { type: String, default: "" },
    },
    isBlocked: { type: Boolean, default: false }
}, {minimize: false})

const userModel = mongoose.models.user || mongoose.model("use", userSchema);
export default userModel;