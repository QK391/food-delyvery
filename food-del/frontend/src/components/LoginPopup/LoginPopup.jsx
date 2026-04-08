import React, { useContext, useEffect, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
    const{url,setToken} = useContext(StoreContext)
    const [currState, setCurrState] = useState("Đăng nhập");
    const [data,setData] = useState({
        name:"",
        email:"",
        password:""
    })
    const onChangeHandler = (event)=>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data =>({...data,[name]:value}))
    }
    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url;
        if (currState==="Đăng nhập"){
            newUrl += "/api/user/login"
        }else{
            newUrl += "/api/user/register"
        }
        try {
            const response = await axios.post(newUrl,data);
            if (response.data.success){
                setToken(response.data.token);
                localStorage.setItem("token",response.data.token);
                setShowLogin(false)
            }else{
                alert(response.data.message)
            }
        } catch (error) {
            console.error("Lỗi khi gọi API đăng nhập/đăng ký:", error);
            alert("Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại server!");
        }
    }
    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.close_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Đăng nhập" ? <></> :
                        <input name="name"
                            onChange={onChangeHandler}
                            value={data.name} type="text"
                            placeholder="Tên của bạn" required
                        />
                    }
                    <input name="email"
                        onChange={onChangeHandler}
                        value={data.email} type="email"
                        placeholder="Email của bạn" required
                    />
                    <input name="password"
                        onChange={onChangeHandler}
                        value={data.password} type="password"
                        placeholder="Mật khẩu của bạn" required
                    />
                </div>
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
    )
}
export default LoginPopup;