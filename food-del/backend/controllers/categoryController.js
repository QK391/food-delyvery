import categoryModel from "../models/categoryModel.js";

const addCategory = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const nameVi = (req.body.nameVi || "").trim();
    if (!name) {
      return res.json({ success: false, message: "Ten danh muc khong duoc de trong" });
    }
    const existing = await categoryModel.findOne({ name });
    if (existing) {
      return res.json({ success: false, message: "Danh muc da ton tai" });
    }
    const image = req.file ? req.file.filename : "";
    const category = new categoryModel({ name, nameVi, image });
    await category.save();
    res.json({ success: true, message: "Them danh muc thanh cong", data: category });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Loi server" });
  }
};

const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Loi server" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Da xoa danh muc" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Loi server" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id, name, nameVi } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (nameVi !== undefined) update.nameVi = nameVi;
    const updatedCategory = await categoryModel.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Loi server" });
  }
};

export { addCategory, listCategories, deleteCategory, updateCategory };
