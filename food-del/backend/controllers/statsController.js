import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const getStats = async (req, res) => {
  try {
    // 1. Summary cards
    const totalOrders = await orderModel.countDocuments();
    const totalRevenue = await orderModel.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalUsers = await userModel.countDocuments();
    const totalFoods = await foodModel.countDocuments();

    // 2. Revenue by month (last 12 months)
    const revenueByMonth = await orderModel.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" },
          date: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), $type: "date" }
        }
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 3. Orders by status
    const ordersByStatus = await orderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 4. Revenue by payment method
    const revenueByPayment = await orderModel.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: "$paymentMethod", revenue: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // 5. Top 5 best-selling foods (by quantity sold)
    const topFoods = await orderModel.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: { $toInt: { $ifNull: ["$items.quantity", 0] } } },
          totalRevenue: {
            $sum: {
              $multiply: [
                { $toDouble: { $ifNull: ["$items.price", 0] } },
                { $toInt: { $ifNull: ["$items.quantity", 0] } }
              ]
            }
          }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalUsers,
          totalFoods,
        },
        revenueByMonth: revenueByMonth.map(r => ({
          month: `${r._id.month}/${r._id.year}`,
          revenue: r.revenue,
          orders: r.orders,
        })),
        ordersByStatus: ordersByStatus.map(s => ({ name: s._id, value: s.count })),
        revenueByPayment: revenueByPayment.map(p => ({
          name: p._id === "cash" ? "Tiền mặt" : p._id === "bank_card" ? "Thẻ NH" : "VNPay",
          revenue: p.revenue,
          count: p.count,
        })),
        topFoods,
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Lỗi server" });
  }
};

export { getStats };
