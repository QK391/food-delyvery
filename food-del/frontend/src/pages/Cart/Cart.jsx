import React, { useContext } from "react";
import "./Cart.css"
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
    const navigate = useNavigate();

    return (
        <div className="cart">
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
                {food_list.map((item, index) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id}>
                                <div className="cart-items-title cart-items-item">
                                    {/* <img src={url + "/images/" + item.image} alt="" /> */}
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
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng</b>
                            <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20 +".000"}VND</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>Tiến hành thanh toán</button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p>Nhập mã khuyến mãi để được giảm giá.</p>
                        <div className="cart-promocode-input">
                            <input type="text" placeholder="Mã giảm giá" />
                            <button>Áp dụng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Cart;