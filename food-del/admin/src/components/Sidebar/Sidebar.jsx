import React from "react";
import './Sidebar.css'
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-options">
                <NavLink to="/dashboard" className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Tổng quan</p>
                </NavLink>
                <NavLink to="/add" className="sidebar-option">
                    <img src={assets.add_icon} alt="" />
                    <p>Thêm món ăn</p>
                </NavLink>
                 <NavLink to="/list" className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Danh sách món ăn</p>
                </NavLink>
                 <NavLink to="/orders" className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Đơn hàng</p>
                </NavLink>
                 <NavLink to="/ratings" className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Đánh giá</p>
                </NavLink>
                 <NavLink to="/coupons" className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Mã giảm giá</p>
                </NavLink>
                 <NavLink to="/categories" className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Thể loại</p>
                </NavLink>
                 <NavLink to="/users" className="sidebar-option">
                    <img src={assets.order_icon} alt="" />
                    <p>Người dùng</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar;