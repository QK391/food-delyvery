import { useContext, useState, useEffect } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useLocation, useSearchParams } from "react-router-dom";
import StarRating from "../../components/StarRating/StarRating";

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const codSuccess = location.state?.codSuccess;
    const vnpayStatus = searchParams.get("vnpay"); // "success" | "cancel" | "error"

    const [ratingStatusMap, setRatingStatusMap] = useState({}); // { [orderId]: { [foodId]: { stars, comment } } }
    const [openRatingForm, setOpenRatingForm] = useState(null); // { orderId, foodId } | null
    const [ratingForm, setRatingForm] = useState({ stars: 0, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updatedOrderId, setUpdatedOrderId] = useState(null);

    const fetchRatingStatuses = async (orders) => {
        const deliveredOrders = orders.filter(o => o.status === "Delivered");
        const map = {};
        await Promise.all(deliveredOrders.map(async (order) => {
            try {
                const res = await axios.get(url + "/api/rating/order/" + order._id, { headers: { token } });
                if (res.data?.success) map[order._id] = res.data.data;
            } catch {}
        }));
        setRatingStatusMap(map);
    };

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
        await fetchRatingStatuses(response.data.data);
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    useEffect(() => {
        if (!token || !data.length) return;

        let userId;
        try {
            userId = JSON.parse(atob(token.split('.')[1])).id;
        } catch {
            return;
        }

        const eventSource = new EventSource(`${url}/api/order/stream/${userId}`);

        eventSource.onmessage = (e) => {
            try {
                const event = JSON.parse(e.data);
                if (event.type === "order_status_update") {
                    setData(prev => prev.map(order =>
                        order._id === event.orderId
                            ? { ...order, status: event.status }
                            : order
                    ));
                    setUpdatedOrderId(event.orderId);
                    setTimeout(() => setUpdatedOrderId(null), 3000);
                    if (event.status === "Delivered") {
                        fetchRatingStatuses([{ _id: event.orderId, status: "Delivered" }]);
                    }
                }
            } catch {}
        };

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => eventSource.close();
    }, [token, url, data.length > 0]);

    const handleSubmitRating = async (orderId, foodId) => {
        if (ratingForm.stars === 0) return;
        setIsSubmitting(true);
        try {
            const res = await axios.post(
                url + "/api/rating/submit",
                { orderId, foodId, stars: ratingForm.stars, comment: ratingForm.comment },
                { headers: { token } }
            );
            if (res.data?.success) {
                setRatingStatusMap(prev => ({
                    ...prev,
                    [orderId]: { ...prev[orderId], [foodId]: { stars: ratingForm.stars, comment: ratingForm.comment } }
                }));
                setOpenRatingForm(null);
                setRatingForm({ stars: 0, comment: '' });
            } else {
                alert(res.data?.message || "Có lỗi xảy ra");
            }
        } catch {
            alert("Không thể kết nối đến máy chủ");
        } finally {
            setIsSubmitting(false);
        }
    };

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

            {vnpayStatus === "success" && (
                <div className="my-orders-cod-banner">
                    <span>✅</span>
                    <div>
                        <strong>Thanh toán VNPay thành công!</strong>
                        <p>Đơn hàng của bạn đã được thanh toán và đang được xử lý.</p>
                    </div>
                </div>
            )}

            {(vnpayStatus === "cancel" || vnpayStatus === "error") && (
                <div className="my-orders-vnpay-fail-banner">
                    <span>❌</span>
                    <div>
                        <strong>Thanh toán thất bại</strong>
                        <p>Giao dịch VNPay bị huỷ hoặc có lỗi. Đơn hàng đã được lưu với trạng thái Cancelled.</p>
                    </div>
                </div>
            )}

            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className={`my-orders-order${order.status === "Cancelled" ? " cancelled" : ""}${order._id === updatedOrderId ? " status-updated" : ""}`}>
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
                                    ? "Ví điện tử (VNPay)"
                                    : "Tiền mặt (COD)"}
                                {" — "}
                                <span className={order.payment ? "paid" : "unpaid"}>
                                    {order.payment
                                        ? "Đã thanh toán"
                                        : order.paymentMethod === "e_wallet"
                                        ? "Chưa thanh toán"
                                        : "Thanh toán khi nhận hàng"}
                                </span>
                            </p>

                            {order.status === "Delivered" && (
                                <div className="my-orders-rating-section">
                                    {order.items.map((item) => {
                                        const foodId = item._id || item.id;
                                        const existingRating = ratingStatusMap[order._id]?.[foodId];
                                        const isFormOpen = openRatingForm?.orderId === order._id && openRatingForm?.foodId === foodId;

                                        return (
                                            <div key={foodId} className="my-orders-rating-item">
                                                <span className="my-orders-rating-item-name">{item.name}</span>
                                                {existingRating ? (
                                                    <div className="my-orders-rating-done">
                                                        <StarRating value={existingRating.stars} size="sm" />
                                                    </div>
                                                ) : isFormOpen ? (
                                                    <div className="my-orders-rating-form">
                                                        <StarRating
                                                            value={ratingForm.stars}
                                                            onChange={(s) => setRatingForm(p => ({ ...p, stars: s }))}
                                                            size="md"
                                                        />
                                                        <textarea
                                                            className="my-orders-rating-textarea"
                                                            placeholder="Nhận xét (tùy chọn)..."
                                                            maxLength={500}
                                                            value={ratingForm.comment}
                                                            onChange={(e) => setRatingForm(p => ({ ...p, comment: e.target.value }))}
                                                        />
                                                        <div className="my-orders-rating-form-actions">
                                                            <button
                                                                className="my-orders-rating-submit"
                                                                onClick={() => handleSubmitRating(order._id, foodId)}
                                                                disabled={isSubmitting || ratingForm.stars === 0}
                                                            >
                                                                Gửi đánh giá
                                                            </button>
                                                            <button
                                                                className="my-orders-rating-cancel"
                                                                onClick={() => { setOpenRatingForm(null); setRatingForm({ stars: 0, comment: '' }); }}
                                                            >
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="my-orders-rating-btn"
                                                        onClick={() => {
                                                            setOpenRatingForm({ orderId: order._id, foodId });
                                                            setRatingForm({ stars: 0, comment: '' });
                                                        }}
                                                    >
                                                        ⭐ Đánh giá
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <button onClick={fetchOrders}>Theo dõi đơn</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MyOrders;