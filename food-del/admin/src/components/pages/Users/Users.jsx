import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Users.css";

const Users = ({ url }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        const res = await axios.get(`${url}/api/user/list`);
        if (res.data.success) {
            setUsers(res.data.data);
        } else {
            toast.error("Không thể tải danh sách người dùng");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBlock = async (userId) => {
        const res = await axios.post(`${url}/api/user/block`, { userId });
        if (res.data.success) {
            toast.success("Đã khóa tài khoản");
            fetchUsers();
        } else {
            toast.error("Thao tác thất bại");
        }
    };

    const handleUnblock = async (userId) => {
        const res = await axios.post(`${url}/api/user/unblock`, { userId });
        if (res.data.success) {
            toast.success("Đã mở khóa tài khoản");
            fetchUsers();
        } else {
            toast.error("Thao tác thất bại");
        }
    };

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="users add">
            <h3>Quản lý người dùng</h3>

            <div className="users-search">
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="users-table">
                <div className="users-table-format title">
                    <b>STT</b>
                    <b>Tên</b>
                    <b>Email</b>
                    <b>Trạng thái</b>
                    <b>Hành động</b>
                </div>
                {filtered.length === 0 ? (
                    <p className="users-empty">Không có người dùng nào.</p>
                ) : (
                    filtered.map((user, index) => (
                        <div key={user._id} className="users-table-format">
                            <p>{index + 1}</p>
                            <p>{user.name}</p>
                            <p>{user.email}</p>
                            <p>
                                <span className={`users-badge ${user.isBlocked ? "blocked" : "active"}`}>
                                    {user.isBlocked ? "Đã khóa" : "Hoạt động"}
                                </span>
                            </p>
                            <p>
                                {user.isBlocked ? (
                                    <button
                                        className="users-btn unblock"
                                        onClick={() => handleUnblock(user._id)}
                                    >
                                        Mở khóa
                                    </button>
                                ) : (
                                    <button
                                        className="users-btn block"
                                        onClick={() => handleBlock(user._id)}
                                    >
                                        Khóa
                                    </button>
                                )}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Users;
