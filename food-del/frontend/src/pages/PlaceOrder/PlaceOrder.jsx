import React, { useContext, useEffect } from "react";
import "./PlaceOrder.css"
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const PlaceOrder = () => {
    const {getTotalCartAmount, token, food_list, cartItems, url}= useContext(StoreContext)
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
        setData((data) => ({...data, [name]: value}))
    }
    const navigate = useNavigate();
    const placeOrder = async(event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) =>{
            if(cartItems[item._id]>0){
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        })
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount()+2,
            paymentMethod,
        };
        let response = await axios.post(url+"/api/order/place", orderData,{headers: {token}});
        if(response.data.success){
            navigate("/myorders");
        }else{
            alert(response.data.message || "Không thể đặt hàng");
        }
    }
    useEffect(() => {
        if(!token){
            navigate("/cart");
        }else if(getTotalCartAmount()===0){
            navigate("/cart");
        }
    },[token])
    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Thông tin giao hàng</p>
                <div className="multi-fields">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name"/>
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name"/>
                </div>
                <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address"/>
                <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street"/>
                <div className="multi-fields">
                    <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City"/>
                    <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State"/>
                </div>
                 <div className="multi-fields">
                    <input required name="zipCode" onChange={onChangeHandler} value={data.zipCode} type="text" placeholder="Zip code"/>
                    <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country"/>
                </div>
                <input name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone"/>
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
                </div>
                {paymentMethod === "bank_card" && (
                    <p className="place-order-payment-hint">
                        Đơn hàng được ghi nhận như đã thanh toán qua thẻ (demo — chưa kết nối cổng thanh toán thật).
                    </p>
                )}
            </div>
            <div className="place-order-right">
                  <div className="cart-total">
                    <h2>Giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Thành tiền</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí giao hàng</p>
                            <p>${getTotalCartAmount()===0?0:2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng</b>
                            <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
                        </div>
                    </div>
                    <button type="submit">Đặt hàng</button>
                </div>
            </div>

        </form>
    )
};
export default PlaceOrder;