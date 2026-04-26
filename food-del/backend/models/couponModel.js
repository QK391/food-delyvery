import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ["percent", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minimumOrderValue: { type: Number, default: 0 },
  usageLimit: { type: Number, default: null },
  usageCount: { type: Number, default: 0 },
  expiryDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);
export default couponModel;
