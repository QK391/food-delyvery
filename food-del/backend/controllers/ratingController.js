import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import ratingModel from "../models/ratingModel.js";
import foodModel from "../models/foodModel.js";

const submitRating = async (req, res) => {
    try {
        const { userId, orderId, foodId, stars, comment } = req.body;

        // 1. Find order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // 2. Check order belongs to user
        if (order.userId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // 3. Check order is delivered
        if (order.status !== "Delivered") {
            return res.json({ success: false, message: "Order is not eligible for rating" });
        }

        // 4. Check foodId is in order items
        const itemInOrder = order.items.find(
            (item) => item._id && (item._id.toString() === foodId || String(item._id) === foodId)
        );
        if (!itemInOrder) {
            return res.json({ success: false, message: "Food item not found in this order" });
        }

        // 5. Check no existing rating for (orderId, foodId)
        const existingRating = await ratingModel.findOne({ orderId, foodId });
        if (existingRating) {
            return res.json({ success: false, message: "You have already rated this item" });
        }

        // 6. Validate stars
        const starsNum = Number(stars);
        if (!Number.isInteger(starsNum) || starsNum < 1 || starsNum > 5) {
            return res.json({ success: false, message: "Stars must be between 1 and 5" });
        }

        // 7. Validate comment length
        if (comment && comment.length > 500) {
            return res.json({ success: false, message: "Comment must not exceed 500 characters" });
        }

        // 8. Validate foodId exists in Food collection
        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        // 9. Save new Rating
        const newRating = new ratingModel({
            orderId,
            userId,
            foodId,
            stars: starsNum,
            comment: comment || "",
        });
        await newRating.save();

        // 10. Recalculate avgRating and ratingCount via aggregation
        const agg = await ratingModel.aggregate([
            { $match: { foodId: new mongoose.Types.ObjectId(foodId) } },
            { $group: { _id: "$foodId", avg: { $avg: "$stars" }, count: { $sum: 1 } } }
        ]);
        const avgRating = agg.length > 0 ? Math.round(agg[0].avg * 10) / 10 : 0;
        const ratingCount = agg.length > 0 ? agg[0].count : 0;
        await foodModel.findByIdAndUpdate(foodId, { avgRating, ratingCount });

        return res.json({ success: true, message: "Rating submitted" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error while submitting rating" });
    }
};

// Task 2.3: getOrderRatingStatus
const getOrderRatingStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.body;

        const ratings = await ratingModel.find({ orderId, userId });
        const data = {};
        for (const r of ratings) {
            data[r.foodId.toString()] = { stars: r.stars, comment: r.comment };
        }
        return res.json({ success: true, data });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error while fetching rating status" });
    }
};

// Task 2.4: getRatingsByFood
const getRatingsByFood = async (req, res) => {
    try {
        const { foodId } = req.params;
        const ratings = await ratingModel
            .find({ foodId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });
        return res.json({ success: true, data: ratings });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error while fetching ratings" });
    }
};

// Task 2.5: listAllRatings
const listAllRatings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const filter = {};
        if (req.query.foodId) filter.foodId = req.query.foodId;
        if (req.query.stars) filter.stars = Number(req.query.stars);

        const total = await ratingModel.countDocuments(filter);
        const data = await ratingModel
            .find(filter)
            .populate("foodId", "name")
            .populate("userId", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.json({
            success: true,
            data,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error while fetching ratings" });
    }
};

// Task 2.7: deleteRating
const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const rating = await ratingModel.findById(ratingId);
        if (!rating) {
            return res.json({ success: false, message: "Rating not found" });
        }
        const foodId = rating.foodId;
        await ratingModel.findByIdAndDelete(ratingId);

        // Recalculate avgRating and ratingCount
        const agg = await ratingModel.aggregate([
            { $match: { foodId: new mongoose.Types.ObjectId(foodId) } },
            { $group: { _id: "$foodId", avg: { $avg: "$stars" }, count: { $sum: 1 } } }
        ]);
        const avgRating = agg.length > 0 ? Math.round(agg[0].avg * 10) / 10 : 0;
        const ratingCount = agg.length > 0 ? agg[0].count : 0;
        await foodModel.findByIdAndUpdate(foodId, { avgRating, ratingCount });

        return res.json({ success: true, message: "Rating deleted" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error while deleting rating" });
    }
};

export { submitRating, getOrderRatingStatus, getRatingsByFood, listAllRatings, deleteRating };
