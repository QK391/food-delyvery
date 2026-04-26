import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const fmtVND = (val) => (val * 1000).toLocaleString("vi-VN") + " VND";

const Dashboard = ({ url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${url}/api/stats`)
      .then(res => {
        if (res.data.success) setData(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) return <div className="dashboard"><p className="dashboard-loading">Đang tải dữ liệu...</p></div>;
  if (!data) return <div className="dashboard"><p>Không thể tải dữ liệu.</p></div>;

  const { summary, revenueByMonth, ordersByStatus, revenueByPayment, topFoods } = data;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* Summary cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card" style={{ borderLeftColor: "#0088FE" }}>
          <h3>Tổng đơn hàng</h3>
          <p className="value">{summary.totalOrders.toLocaleString("vi-VN")}</p>
        </div>
        <div className="dashboard-card" style={{ borderLeftColor: "#00C49F" }}>
          <h3>Doanh thu</h3>
          <p className="value">{fmtVND(summary.totalRevenue)}</p>
        </div>
        <div className="dashboard-card" style={{ borderLeftColor: "#FFBB28" }}>
          <h3>Người dùng</h3>
          <p className="value">{summary.totalUsers.toLocaleString("vi-VN")}</p>
        </div>
        <div className="dashboard-card" style={{ borderLeftColor: "#FF8042" }}>
          <h3>Món ăn</h3>
          <p className="value">{summary.totalFoods.toLocaleString("vi-VN")}</p>
        </div>
      </div>

      {/* Revenue by month */}
      <div className="dashboard-section">
        <h3>Doanh thu theo tháng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" tickFormatter={(v) => (v * 1000).toLocaleString("vi-VN")} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value, name) => name === "revenue" ? fmtVND(value) : value} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#0088FE" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="orders" name="Đơn hàng" stroke="#FF8042" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie + Bar row */}
      <div className="dashboard-charts-row">
        <div className="dashboard-section">
          <h3>Đơn hàng theo trạng thái</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                {ordersByStatus.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-section">
          <h3>Doanh thu theo phương thức thanh toán</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByPayment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => (v * 1000).toLocaleString("vi-VN")} />
              <Tooltip formatter={(value) => fmtVND(value)} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top foods table */}
      <div className="dashboard-section">
        <h3>Top 5 món bán chạy</h3>
        <table className="dashboard-top-foods">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên món</th>
              <th>Số lượng bán</th>
              <th>Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {topFoods.map((food, i) => (
              <tr key={food._id}>
                <td>{i + 1}</td>
                <td>{food._id}</td>
                <td>{food.totalQty.toLocaleString("vi-VN")}</td>
                <td>{fmtVND(food.totalRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
