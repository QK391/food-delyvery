import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createCoupon, listCoupons, deleteCoupon, validateCoupon } from "../controllers/couponController.js";

const couponRouter = express.Router();
couponRouter.post("/create", createCoupon);
couponRouter.get("/list", listCoupons);
couponRouter.delete("/:id", deleteCoupon);
couponRouter.post("/validate", authMiddleware, validateCoupon);

export default couponRouter;
