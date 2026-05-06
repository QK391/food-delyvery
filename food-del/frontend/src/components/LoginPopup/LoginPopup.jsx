import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Đăng nhập");
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === "Đăng nhập") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }
        try {
            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API đăng nhập/đăng ký:", error);
            alert("Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại server!");
        }
    };

    const onForgotPassword = async (event) => {
        event.preventDefault();
        setForgotLoading(true);
        setForgotMessage("");
        try {
            const response = await axios.post(`${url}/api/user/forgot-password`, { email: forgotEmail });
            setForgotMessage(response.data.message || "Kiểm tra email của bạn để đặt lại mật khẩu.");
        } catch (error) {
            setForgotMessage("Lỗi kết nối. Vui lòng thử lại.");
        } finally {
            setForgotLoading(false);
        }
    };

    if (currState === "Quên mật khẩu") {
        return (
            <div className="login-popup">
                <form onSubmit={onForgotPassword} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>Quên mật khẩu</h2>
                        <img onClick={() => setShowLogin(false)} src={assets.close_icon} alt="" />
                    </div>
                    <div className="login-popup-inputs">
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                        />
                    </div>
                    {forgotMessage && <p style={{ color: "#27ae60", fontSize: "13px", margin: 0 }}>{forgotMessage}</p>}
                    <button type="submit" disabled={forgotLoading}>
                        {forgotLoading ? "Đang gửi..." : "Gửi email đặt lại"}
                    </button>
                    <p>
                        <span onClick={() => { setCurrState("Đăng nhập"); setForgotMessage(""); }}>
                            Quay lại đăng nhập
                        </span>
                    </p>
                </form>
            </div>
        );
    }

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.close_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState !== "Đăng nhập" &&
                        <input name="name"
                            onChange={onChangeHandler}
                            value={data.name} type="text"
                            placeholder="Tên của bạn" required
                        />
                    }
                    <input name="email"
                        onChange={onChangeHandler}
                        value={data.email} type="email"
                        placeholder="Email" required
                    />
                    <input name="password"
                        onChange={onChangeHandler}
                        value={data.password} type="password"
                        placeholder="Mật khẩu" required
                    />
                </div>
                {currState === "Đăng nhập" &&
                    <p style={{ margin: "-10px 0 0", fontSize: "13px" }}>
                        <span onClick={() => setCurrState("Quên mật khẩu")}>Quên mật khẩu?</span>
                    </p>
                }
                <button type="submit">{currState === "Đăng ký" ? "Tạo tài khoản" : "Đăng nhập"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>Tôi đồng ý với các điều khoản sử dụng và chính sách quyền riêng tư.</p>
                </div>
                {currState === "Đăng nhập" ?
                    <p>Chưa có tài khoản? <span onClick={() => setCurrState("Đăng ký")}>Đăng ký ngay</span></p> :
                    <p>Đã có tài khoản? <span onClick={() => setCurrState("Đăng nhập")}>Đăng nhập</span></p>
                }
            </form>
        </div>
    );
};

export default LoginPopup;
