import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ url, onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await axios.post(`${url}/api/user/admin-login`, { username, password });
            if (res.data.success) {
                sessionStorage.setItem("adminLoggedIn", "true");
                onLogin();
            } else {
                setError(res.data.message || "Sai tên đăng nhập hoặc mật khẩu");
            }
        } catch {
            setError("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <form className="admin-login-form" onSubmit={handleSubmit}>
                <h2>Admin Panel</h2>
                <p className="admin-login-subtitle">Đăng nhập để tiếp tục</p>
                <div className="admin-login-field">
                    <label>Tên đăng nhập</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập tên đăng nhập"
                        required
                        autoFocus
                    />
                </div>
                <div className="admin-login-field">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        required
                    />
                </div>
                {error && <p className="admin-login-error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
};

export default Login;
