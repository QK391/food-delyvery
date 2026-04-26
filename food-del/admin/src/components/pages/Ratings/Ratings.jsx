import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Ratings.css";

const Ratings = ({ url }) => {
    const [ratings, setRatings] = useState([]);
    const [foods, setFoods] = useState([]);
    const [filterFood, setFilterFood] = useState("");
    const [filterStars, setFilterStars] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFoods = async () => {
        const res = await axios.get(`${url}/api/food/list`);
        if (res.data.success) {
            setFoods(res.data.data);
        }
    };

    const fetchRatings = async (currentPage, foodId, stars) => {
        const params = { page: currentPage };
        if (foodId) params.foodId = foodId;
        if (stars) params.stars = stars;
        const res = await axios.get(`${url}/api/rating/list`, { params });
        if (res.data.success) {
            setRatings(res.data.data);
            setTotalPages(res.data.pages || 1);
        } else {
            toast.error("Không thể tải danh sách đánh giá");
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        fetchRatings(page, filterFood, filterStars);
    }, [page, filterFood, filterStars]);

    const handleFoodFilter = (e) => {
        setFilterFood(e.target.value);
        setPage(1);
    };

    const handleStarsFilter = (e) => {
        setFilterStars(e.target.value);
        setPage(1);
    };

    const handleDelete = async (ratingId) => {
        const res = await axios.delete(`${url}/api/rating/${ratingId}`);
        if (res.data.success) {
            toast.success("Đã xóa đánh giá");
            fetchRatings(page, filterFood, filterStars);
        } else {
            toast.error("Xóa thất bại");
        }
    };

    const renderStars = (count) => {
        return "★".repeat(count) + "☆".repeat(5 - count);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("vi-VN");
    };

    return (
        <div className="ratings add">
            <h3>Quản lý đánh giá</h3>

            <div className="ratings-filter">
                <select value={filterFood} onChange={handleFoodFilter}>
                    <option value="">Tất cả món ăn</option>
                    {foods.map((f) => (
                        <option key={f._id} value={f._id}>{f.name}</option>
                    ))}
                </select>
                <select value={filterStars} onChange={handleStarsFilter}>
                    <option value="">Tất cả số sao</option>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <option key={s} value={s}>{s} sao</option>
                    ))}
                </select>
            </div>

            <div className="ratings-table">
                <div className="ratings-table-format title">
                    <b>Món ăn</b>
                    <b>Người dùng</b>
                    <b>Sao</b>
                    <b>Nhận xét</b>
                    <b>Ngày</b>
                    <b>Xóa</b>
                </div>
                {ratings.length === 0 ? (
                    <p className="ratings-empty">Không có đánh giá nào.</p>
                ) : (
                    ratings.map((r) => (
                        <div key={r._id} className="ratings-table-format">
                            <p>{r.foodId?.name || "—"}</p>
                            <p>{r.userId?.name || "—"}</p>
                            <p className="ratings-stars">{renderStars(r.stars)}</p>
                            <p>{r.comment || "—"}</p>
                            <p>{formatDate(r.createdAt)}</p>
                            <p
                                className="ratings-delete cursor"
                                onClick={() => handleDelete(r._id)}
                            >
                                X
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="ratings-pagination">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    ← Trước
                </button>
                <span>Trang {page} / {totalPages}</span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Tiếp →
                </button>
            </div>
        </div>
    );
};

export default Ratings;
