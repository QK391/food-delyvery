import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Categories.css";

const Categories = ({ url }) => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [nameVi, setNameVi] = useState("");
    const [image, setImage] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${url}/api/category/list`);
            if (res.data?.success) {
                setCategories(res.data.data);
            }
        } catch (err) {
            console.error("fetchCategories error:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("nameVi", nameVi.trim());
            if (image) formData.append("image", image);

            const res = await axios.post(`${url}/api/category/add`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                toast.success("Thêm danh mục thành công!");
                setName("");
                setNameVi("");
                setImage(null);
                await fetchCategories();
            } else {
                toast.error(res.data.message || "Thêm thất bại");
            }
        } catch (err) {
            console.error(err);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.post(`${url}/api/category/delete`, { id });
            if (res.data.success) {
                toast.success("Đã xóa danh mục");
                await fetchCategories();
            } else {
                toast.error("Xóa thất bại");
            }
        } catch (err) {
            console.error(err);
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    return (
        <div className="categories add">
            <h3>Quản lý danh mục</h3>

            <form className="categories-form" onSubmit={handleSubmit}>
                <div className="categories-form-fields">
                    <div className="categories-field">
                        <label>Tên (English)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Salad"
                        />
                    </div>
                    <div className="categories-field">
                        <label>Tên tiếng Việt</label>
                        <input
                            type="text"
                            value={nameVi}
                            onChange={e => setNameVi(e.target.value)}
                            placeholder="e.g. Salad"
                        />
                    </div>
                    <div className="categories-field">
                        <label>Hình ảnh (tuỳ chọn)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImage(e.target.files[0])}
                        />
                    </div>
                </div>
                <button type="submit" className="categories-btn">Thêm danh mục</button>
            </form>

            <div className="categories-table">
                <div className="categories-table-format title">
                    <b>Hình ảnh</b>
                    <b>Tên</b>
                    <b>Tên tiếng Việt</b>
                    <b>Xóa</b>
                </div>
                {categories.length === 0 ? (
                    <p className="categories-empty">Chưa có danh mục nào.</p>
                ) : (
                    categories.map(cat => (
                        <div key={cat._id} className="categories-table-format">
                            <div>
                                {cat.image
                                    ? <img src={`${url}/images/${cat.image}`} alt={cat.name} className="categories-thumb" />
                                    : <span>—</span>
                                }
                            </div>
                            <p>{cat.name}</p>
                            <p>{cat.nameVi || "—"}</p>
                            <p
                                className="categories-delete cursor"
                                onClick={() => handleDelete(cat._id)}
                            >
                                X
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Categories;
