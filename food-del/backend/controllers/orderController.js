import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import couponModel from "../models/couponModel.js";
import { createVnpayUrl, verifyVnpayReturn } from "../utils/vnpay.js";
import { addClient, removeClient, sendToUser } from "../utils/sseManager.js";

const placeOrder = async (req, res) => {
  try {
    const paymentMethod = ["bank_card", "e_wallet"].includes(req.body.paymentMethod)
      ? req.body.paymentMethod
      : "cash";
    const paid = paymentMethod === "bank_card";

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod,
      payment: paid,
      couponCode: req.body.couponCode || null,
    });
    await newOrder.save();

    if (req.body.couponCode) {
      await couponModel.findOneAndUpdate(
        { code: req.body.couponCode.toUpperCase() },
        { $inc: { usageCount: 1 } }
      );
    }

    // Chỉ xoá cart ngay nếu không phải e_wallet (e_wallet chờ VNPay callback)
    if (paymentMethod !== "e_wallet") {
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    }

    res.json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while placing order" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndUpdate(
      req.body.orderId,
      { status: req.body.status },
      { new: true }
    );
    if (order) {
      sendToUser(order.userId.toString(), {
        type: "order_status_update",
        orderId: order._id.toString(),
        status: req.body.status,
      });
    }
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const streamOrderUpdates = async (req, res) => {
  const userId = req.params.userId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  addClient(userId, res);

  const heartbeat = setInterval(() => {
    try { res.write(`: heartbeat\n\n`); } catch {}
  }, 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeClient(userId, res);
  });
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true" || success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

/**
 * Tạo URL thanh toán VNPay và trả về cho frontend redirect
 */
const createVnpayPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    const ipAddr =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    const returnUrl = `${process.env.BACKEND_URL || "http://localhost:3050"}/api/order/vnpay-return`;

    const payUrl = createVnpayUrl({
      orderId: order._id.toString(),
      amount: order.amount,
      orderInfo: `Thanh toan don hang ${order._id}`,
      ipAddr,
      returnUrl,
    });

    res.json({ success: true, payUrl });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error creating VNPay payment" });
  }
};

/**
 * VNPay callback sau khi thanh toán (GET redirect)
 */
const vnpayReturn = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const isValid = verifyVnpayReturn(req.query);
    const responseCode = req.query["vnp_ResponseCode"];
    const orderId = req.query["vnp_TxnRef"];

    if (isValid && responseCode === "00") {
      // Thanh toán thành công: đánh dấu đã TT và xoá cart
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );
      if (order) {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }
      return res.redirect(`${frontendUrl}/myorders?vnpay=success`);
    } else {
      // Huỷ hoặc thất bại: đổi status thành Cancelled, KHÔNG xoá đơn
      await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
      return res.redirect(`${frontendUrl}/myorders?vnpay=cancel`);
    }
  } catch (error) {
    console.log(error);
    res.redirect(`${frontendUrl}/myorders?vnpay=error`);
  }
};

export { placeOrder, userOrders, listOrders, updateOrderStatus, verifyOrder, createVnpayPayment, vnpayReturn, streamOrderUpdates };

