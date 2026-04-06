import React, { useContext } from 'react';
import './VnpayMock.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const VnpayMock = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);

    const handleVerify = async (success) => {
        try {
            const response = await axios.post(`${url}/api/order/verify`, {
                orderId,
                success
            });
            if (response.data.success) {
                navigate('/myorders');
            } else {
                navigate('/cart');
            }
        } catch (error) {
            console.error(error);
            navigate('/cart');
        }
    };

    return (
        <div className="vnpay-mock">
            <div className="vnpay-mock-container">
                <div className="vnpay-header">
                    <h2>VNPay Sandbox Simulation</h2>
                    <p>Mô phỏng Cổng thanh toán VNPay</p>
                </div>
                <div className="vnpay-body">
                    <p>Mã đơn hàng: <strong>{orderId}</strong></p>
                    <p>Vui lòng xác nhận để hoàn tất quá trình thanh toán mô phỏng.</p>
                </div>
                <div className="vnpay-actions">
                    <button className="btn-success" onClick={() => handleVerify(true)}>Thanh toán thành công</button>
                    <button className="btn-cancel" onClick={() => handleVerify(false)}>Huỷ thanh toán</button>
                </div>
            </div>
        </div>
    );
};

export default VnpayMock;
