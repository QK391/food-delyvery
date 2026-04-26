import express from "express";
import multer from "multer";
import path from "path";
import { addCategory, listCategories, deleteCategory, updateCategory } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

categoryRouter.post("/add", upload.single("image"), addCategory);
categoryRouter.get("/list", listCategories);
categoryRouter.post("/delete", deleteCategory);
categoryRouter.post("/update", updateCategory);

export default categoryRouter;
