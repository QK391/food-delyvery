import { useContext, useState, useEffect } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useLocation } from "react-router-dom";

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const location = useLocation();
    const codSuccess = location.state?.codSuccess;

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="my-orders">
            <h2>Đơn hàng của tôi</h2>
            {codSuccess && (
                <div className="my-orders-cod-banner">
                    <span>✅</span>
                    <div>
                        <strong>Đặt hàng thành công!</strong>
                        <p>Đơn hàng của bạn đã được ghi nhận. Vui lòng thanh toán bằng tiền mặt khi nhận hàng.</p>
                    </div>
                </div>
            )}
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.box_icon} alt="" />
                        <p>
                            {order.items.map((item, i) =>
                                i === order.items.length - 1
                                    ? `${item.name} x ${item.quantity}`
                                    : `${item.name} x ${item.quantity}, `
                            )}
                        </p>
                        <p>{order.amount}.000 VND</p>
                        <p>Số món: {order.items.length}</p>
                        <div className="my-orders-status-block">
                            <p><span>&#x25cf;</span><b>{order.status}</b></p>
                            <p className="my-orders-payment">
                                {order.paymentMethod === "bank_card"
                                    ? "Thẻ ngân hàng"
                                    : order.paymentMethod === "e_wallet"
                                    ? "Ví điện tử"
                                    : "Tiền mặt (COD)"}
                                {" — "}
                                <span className={order.payment ? "paid" : "unpaid"}>
                                    {order.payment ? "Đã thanh toán" : "Thanh toán khi nhận hàng"}
                                </span>
                            </p>
                        </div>
                        <button onClick={fetchOrders}>Theo dõi đơn</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MyOrders;