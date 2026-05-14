import React, { useState } from "react";
import './Navbar.css'
import { assets } from "../../assets/assets";
import ChangePassword from "../ChangePassword/ChangePassword";

const Navbar = ({ onLogout, url }) => {
    const [showChangePassword, setShowChangePassword] = useState(false);

    return (
        <>
            <div className="navbar">
                <img className="logo" src={assets.logo} alt="" />
                <div className="navbar-right">
                    <img className="profile" src={assets.profile_img} alt="" />
                    <button
                        className="navbar-change-password"
                        onClick={() => setShowChangePassword(true)}
                    >
                        Đổi mật khẩu
                    </button>
                    {onLogout && (
                        <button className="navbar-logout" onClick={onLogout}>
                            Đăng xuất
                        </button>
                    )}
                </div>
            </div>
            {showChangePassword && (
                <ChangePassword
                    url={url}
                    onClose={() => setShowChangePassword(false)}
                />
            )}
        </>
    );
};

export default Navbar;
