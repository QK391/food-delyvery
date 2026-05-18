import React, { useEffect, useState } from "react";
import axios from "axios";
import './List.css';
import { toast } from "react-toastify";

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [confirmId, setConfirmId] = useState(null);

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/food/list`)
        if (response.data.success) {
            setList(response.data.data)
        } else {
            toast.error("Error")
        }
    }

    const removeFood = async (foodId) => {
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
        setConfirmId(null);
        await fetchList();
        if (response.data.success) {
            toast.success("Đã xóa món ăn thành công")
        } else {
            toast.error("Xóa thất bại")
        }
    }

    useEffect(() => {
        fetchList();
    }, [])

    return (
        <div className="list add flex-col">
            <p>Tất cả danh sách</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Ảnh</b>
                    <b>Tên món</b>
                    <b>Loại</b>
                    <b>Giá</b>
                    <b>Hoạt động</b>
                </div>
                {list.map((item, index) => (
                    <div key={index} className="list-table-format">
                        <img src={`${url}/images/` + item.image} alt="" />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{(item.price * 1000).toLocaleString("vi-VN")} VND</p>
                        <div className="list-action">
                            {confirmId === item._id ? (
                                <div className="list-confirm">
                                    <span>Xóa món này?</span>
                                    <button className="list-btn-confirm" onClick={() => removeFood(item._id)}>Xác nhận</button>
                                    <button className="list-btn-cancel" onClick={() => setConfirmId(null)}>Hủy</button>
                                </div>
                            ) : (
                                <button className="list-btn-delete" onClick={() => setConfirmId(item._id)}>
                                    🗑 Xóa
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default List