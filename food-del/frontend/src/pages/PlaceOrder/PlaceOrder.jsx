import React, { useContext, useEffect } from "react";
import "./PlaceOrder.css"
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, setCartItems, url } = useContext(StoreContext)
    const [data, setData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
    });
    const [paymentMethod, setPaymentMethod] = React.useState("cash");
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }))
    }
    const navigate = useNavigate();
    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        })
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
            paymentMethod,
        };
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
            const orderId = response.data.orderId;
            if (paymentMethod === "e_wallet") {
                // Gọi backend tạo URL VNPay thật
                const vnpRes = await axios.post(url + "/api/order/vnpay-create", { orderId }, { headers: { token } });
                if (vnpRes.data.success) {
                    setCartItems({});
                    window.location.href = vnpRes.data.payUrl; // redirect sang VNPay
                } else {
                    alert("Không thể tạo liên kết thanh toán VNPay");
                }
            } else if (paymentMethod === "cash") {
                setCartItems({});
                navigate("/myorders", { state: { codSuccess: true } });
            } else {
                setCartItems({});
                navigate("/myorders");
            }
        } else {
            alert("Có lỗi xảy ra");
        }
    }
    useEffect(() => {
        if (!token) {
            navigate("/cart");
        } else if (getTotalCartAmount() === 0) {
            navigate("/cart");
        }
    }, [token])
    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Thông tin giao hàng</p>
                <div className="multi-fields">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="Tên" />
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Họ" />
                </div>
                <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Địa chỉ email" />
                <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Địa chỉ" />
                <div className="multi-fields">
                    <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="Thành phố" />
                    <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="Tỉnh/Thành" />
                </div>
                <div className="multi-fields">
                    <input required name="zipCode" onChange={onChangeHandler} value={data.zipCode} type="text" placeholder="Mã bưu điện" />
                    <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Quốc gia" />
                </div>
                <input name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Số điện thoại" />
                <p className="place-order-section-title">Phương thức thanh toán</p>
                <div className="place-order-payment-options">
                    <label className="place-order-payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={() => setPaymentMethod("cash")}
                        />
                        <span>Tiền mặt khi nhận hàng (COD)</span>
                    </label>
                    <label className="place-order-payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="bank_card"
                            checked={paymentMethod === "bank_card"}
                            onChange={() => setPaymentMethod("bank_card")}
                        />
                        <span>Thẻ ngân hàng</span>
                    </label>
                    <label className="place-order-payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="e_wallet"
                            checked={paymentMethod === "e_wallet"}
                            onChange={() => setPaymentMethod("e_wallet")}
                        />
                        <span>Ví điện tử VNPay</span>
                    </label>
                </div>
                {paymentMethod === "bank_card" && (
                    <p className="place-order-payment-hint">
                        Đơn hàng được ghi nhận như đã thanh toán qua thẻ (demo — chưa kết nối cổng thanh toán thật).
                    </p>
                )}
                {paymentMethod === "e_wallet" && (
                    <p className="place-order-payment-hint">
                        Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch.
                    </p>
                )}
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Thành tiền</p>
                            <p>{getTotalCartAmount()}.000 VND</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí giao hàng</p>
                            <p>{getTotalCartAmount() === 0 ? 0 : "20.000"} VND</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng</b>
                            <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}.000 VND</b>
                        </div>
                    </div>
                    <button type="submit">Thanh toán</button>
                </div>
            </div>
        </form>
    )
};
export default PlaceOrder;