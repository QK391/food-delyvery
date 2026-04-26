import express from "express";
import authMiddleware from "../middleware/auth.js";
import { submitRating, getOrderRatingStatus, getRatingsByFood, listAllRatings, deleteRating } from "../controllers/ratingController.js";

const ratingRouter = express.Router();

ratingRouter.post("/submit", authMiddleware, submitRating);
ratingRouter.get("/food/:foodId", getRatingsByFood);
ratingRouter.get("/order/:orderId", authMiddleware, getOrderRatingStatus);
ratingRouter.get("/list", listAllRatings);
ratingRouter.delete("/:ratingId", deleteRating);

export default ratingRouter;
