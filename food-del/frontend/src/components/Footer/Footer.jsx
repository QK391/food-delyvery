import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
    return (
        <div className="footer" id="footer">
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>© 2026 FoodMart.</p>
                </div>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.instagram_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                </div>
                <div className="footer-content-center">
                    <h2>CÔNG TY</h2>
                    <ul>
                        <li>Trang chủ</li>
                        <li>Về chúng tôi</li>
                        <li>Tuyển dụng</li>
                        <li>Tin tức</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>LIÊN HỆ</h2>
                    <ul>
                        <li>0866062568</li>
                        <li>contact@foodmart.com</li>
                    </ul>
                </div>
            </div>
            <hr/>
            <p className="footer-copyright">© 2026 FoodMart. Mọi quyền được bảo lưu.</p>
        </div>
    );
}
export default Footer;