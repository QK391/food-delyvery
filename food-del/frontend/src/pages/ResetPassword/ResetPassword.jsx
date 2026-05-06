import React, { useState, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./ResetPassword.css";

const ResetPassword = () => {
    const { url } = useContext(StoreContext);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword.length < 8) {
            return setError("Mật khẩu phải có ít nhất 8 ký tự.");
        }
        if (newPassword !== confirmPassword) {
            return setError("Mật khẩu xác nhận không khớp.");
        }

        setLoading(true);
        try {
            const response = await axios.post(`${url}/api/user/reset-password`, { token, newPassword });
            if (response.data.success) {
                setMessage(response.data.message);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Lỗi kết nối. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="reset-password-page">
                <div className="reset-password-container">
                    <p className="reset-error">Link không hợp lệ.</p>
                    <Link to="/">Về trang chủ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <h2>Đặt lại mật khẩu</h2>
                {message ? (
                    <div className="reset-success">
                        <p>{message}</p>
                        <Link to="/">Về trang chủ để đăng nhập</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {error && <p className="reset-error">{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
