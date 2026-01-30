import mongoose from "mongoose";
//mongodb+srv://lexuanky391_db_user:t3cExwxswQ3xKlzy@cluster0.cavfwoj.mongodb.net/?
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://lexuanky391_db_user:t3cExwxswQ3xKlzy@cluster0.cavfwoj.mongodb.net/food-delivery')
    .then(()=>console.log("DB Connected"))
}