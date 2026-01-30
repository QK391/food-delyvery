import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"

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

app.get("/", (req,res)=>{
    res.send("API working")
})
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
