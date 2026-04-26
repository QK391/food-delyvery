import React, { useContext, useState } from "react";
import "./Cart.css"
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, token, appliedCoupon, setAppliedCoupon } = useContext(StoreContext);
    const navigate = useNavigate();
    const [couponInput, setCouponInput] = useState("");

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        try {
            const res = await axios.post(url + "/api/coupon/validate",
                { code: couponInput.trim(), cartTotal: getTotalCartAmount() },
                { headers: { token } }
            );
            if (res.data?.success) {
                setAppliedCoupon({ code: res.data.data.code, discountAmount: res.data.data.discountAmount });
                toast.success("Ap dung ma giam gia thanh cong!");
            } else {
                toast.error(res.data?.message || "Co loi xay ra");
            }
        } catch {
            toast.error("Khong the ket noi den may chu");
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput("");
    };

    const discountAmount = appliedCoupon?.discountAmount ?? 0;
    const total = getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20 - discountAmount;

    return (
        <div className="cart">
            <ToastContainer />
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Ảnh</p>
                    <p>Tên món</p>
                    <p>Giá tiền</p>
                    <p>Số lượng</p>
                    <p>Tổng</p>
                    <p>Xóa</p>
                </div>
                <br />
                <hr />
                {food_list.map((item) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={item.image} alt="" />
                                    <p>{item.name}</p>
                                    <p>{item.price}VND</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p>{item.price * cartItems[item._id]}.000VND</p>
                                    <p onClick={() => removeFromCart(item._id)} className="cross">x</p>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                })}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Giá tiền</p>
                            <p>{getTotalCartAmount() + ".000"}VND</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí giao hàng</p>
                            <p>{getTotalCartAmount() === 0 ? 0 : "20.000"}VND</p>
                        </div>
                        {appliedCoupon && (
                            <>
                                <hr />
                                <div className="cart-total-details">
                                    <p>Giảm giá ({appliedCoupon.code})</p>
                                    <p style={{ color: "tomato" }}>-{appliedCoupon.discountAmount}.000 VND</p>
                                </div>
                            </>
                        )}
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng</b>
                            <b>{getTotalCartAmount() === 0 ? 0 : total + ".000"}VND</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>Tiến hành thanh toán</button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p>Nhập mã khuyến mãi để được giảm giá.</p>
                        <div className="cart-promocode-input">
                            <input
                                type="text"
                                placeholder="Mã giảm giá"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                disabled={!!appliedCoupon}
                            />
                            {appliedCoupon ? (
                                <button type="button" onClick={handleRemoveCoupon} style={{ backgroundColor: "tomato" }}>Xóa mã</button>
                            ) : (
                                <button type="button" onClick={handleApplyCoupon}>Áp dụng</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Cart;