import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  orderId:   { type: mongoose.Schema.Types.ObjectId, ref: 'order',  required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'use',    required: true },
  foodId:    { type: mongoose.Schema.Types.ObjectId, ref: 'food',   required: true },
  stars:     { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, default: '', maxlength: 500 },
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index: mỗi (orderId, foodId) chỉ có 1 rating
ratingSchema.index({ orderId: 1, foodId: 1 }, { unique: true });

const ratingModel = mongoose.models.rating || mongoose.model("rating", ratingSchema);
export default ratingModel;
