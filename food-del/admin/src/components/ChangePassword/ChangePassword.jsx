import React, { useState } from "react";
import axios from "axios";
import "./ChangePassword.css";

const ChangePassword = ({ url, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            return setError("Mật khẩu xác nhận không khớp");
        }
        if (newPassword.length < 6) {
            return setError("Mật khẩu mới phải có ít nhất 6 ký tự");
        }

        setLoading(true);
        try {
            const res = await axios.post(`${url}/api/user/admin-change-password`, {
                currentPassword,
                newPassword,
            });
            if (res.data.success) {
                setSuccess("Đổi mật khẩu thành công! Lưu ý: cập nhật file .env để lưu vĩnh viễn.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setError(res.data.message || "Có lỗi xảy ra");
            }
        } catch {
            setError("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-overlay" onClick={onClose}>
            <div className="change-password-modal" onClick={(e) => e.stopPropagation()}>
                <div className="change-password-header">
                    <h3>Đổi mật khẩu Admin</h3>
                    <button className="change-password-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="change-password-field">
                        <label>Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                        />
                    </div>
                    <div className="change-password-field">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Ít nhất 6 ký tự"
                            required
                        />
                    </div>
                    <div className="change-password-field">
                        <label>Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            required
                        />
                    </div>
                    {error && <p className="change-password-error">{error}</p>}
                    {success && <p className="change-password-success">{success}</p>}
                    <div className="change-password-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
