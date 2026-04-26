import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import ratingRouter from "./routes/ratingRoute.js";
import couponRouter from "./routes/couponRoute.js";
import categoryRouter from "./routes/categoryRoute.js";

//app config
const app = express()
const port = 3050

//middleware
app.use(express.json())
app.use(cors())

//DB connect
connectDB();

//api endpoints, foodRouter 
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/rating", ratingRouter)
app.use("/api/coupon", couponRouter)
app.use("/api/category", categoryRouter)

app.get("/", (req,res)=>{
    res.send("API working")
})
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
