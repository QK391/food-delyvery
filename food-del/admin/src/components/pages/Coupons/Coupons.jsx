import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Coupons.css";

const Coupons = ({ url }) => {
    const [coupons, setCoupons] = useState([]);
    const [form, setForm] = useState({
        code: "",
        discountType: "percent",
        discountValue: "",
        minimumOrderValue: "",
        usageLimit: "",
        expiryDate: "",
    });

    const fetchCoupons = async () => {
        const res = await axios.get(`${url}/api/coupon/list`);
        if (res.data.success) {
            setCoupons(res.data.data);
        } else {
            toast.error("Không thể tải danh sách mã giảm giá");
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            code: form.code,
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            minimumOrderValue: form.minimumOrderValue ? Number(form.minimumOrderValue) : 0,
            usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
            expiryDate: form.expiryDate || null,
        };
        const res = await axios.post(`${url}/api/coupon/create`, payload);
        if (res.data.success) {
            toast.success("Tạo mã giảm giá thành công!");
            setForm({ code: "", discountType: "percent", discountValue: "", minimumOrderValue: "", usageLimit: "", expiryDate: "" });
            fetchCoupons();
        } else {
            toast.error(res.data.message || "Tạo thất bại");
        }
    };

    const handleDelete = async (id) => {
        const res = await axios.delete(`${url}/api/coupon/${id}`);
        if (res.data.success) {
            toast.success("Đã xóa mã giảm giá");
            fetchCoupons();
        } else {
            toast.error("Xóa thất bại");
        }
    };

    const getStatus = (coupon) => {
        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            return <span className="coupon-badge coupon-badge--expired">Hết hạn</span>;
        }
        if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
            return <span className="coupon-badge coupon-badge--exhausted">Hết lượt</span>;
        }
        return <span className="coupon-badge coupon-badge--active">Còn hiệu lực</span>;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("vi-VN");
    };

    return (
        <div className="coupons add">
            <h3>Quản lý mã giảm giá</h3>

            <form onSubmit={handleSubmit} className="coupon-form">
                <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Mã giảm giá (VD: SALE10)"
                    required
                />
                <select name="discountType" value={form.discountType} onChange={handleChange}>
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Cố định (VND)</option>
                </select>
                <input
                    name="discountValue"
                    value={form.discountValue}
                    onChange={handleChange}
                    type="number"
                    placeholder="Giá trị giảm"
                    required
                />
                <input
                    name="minimumOrderValue"
                    value={form.minimumOrderValue}
                    onChange={handleChange}
                    type="number"
                    placeholder="Đơn tối thiểu (tùy chọn)"
                />
                <input
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={handleChange}
                    type="number"
                    placeholder="Giới hạn lượt dùng (tùy chọn)"
                />
                <input
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    type="date"
                    placeholder="Ngày hết hạn (tùy chọn)"
                />
                <button type="submit">Tạo mã</button>
            </form>

            <div className="coupon-table">
                <div className="coupon-table-row coupon-table-header">
                    <b>Mã</b>
                    <b>Loại</b>
                    <b>Giá trị</b>
                    <b>Đơn tối thiểu</b>
                    <b>Đã dùng / Giới hạn</b>
                    <b>Hết hạn</b>
                    <b>Trạng thái</b>
                    <b>Xóa</b>
                </div>
                {coupons.length === 0 ? (
                    <p className="coupon-empty">Chưa có mã giảm giá nào.</p>
                ) : (
                    coupons.map((c) => (
                        <div key={c._id} className="coupon-table-row">
                            <p>{c.code}</p>
                            <p>{c.discountType === "percent" ? "%" : "Cố định"}</p>
                            <p>{c.discountValue}{c.discountType === "percent" ? "%" : ".000 VND"}</p>
                            <p>{c.minimumOrderValue ? c.minimumOrderValue + ".000 VND" : "—"}</p>
                            <p>{c.usageCount} / {c.usageLimit ?? "∞"}</p>
                            <p>{formatDate(c.expiryDate)}</p>
                            <p>{getStatus(c)}</p>
                            <p className="coupon-delete" onClick={() => handleDelete(c._id)}>X</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Coupons;
