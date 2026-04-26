import couponModel from "../models/couponModel.js";

const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minimumOrderValue, usageLimit, expiryDate } = req.body;

    if (discountType === "percent" && (discountValue < 1 || discountValue > 100)) {
      return res.json({ success: false, message: "Gia tri phan tram phai tu 1 den 100" });
    }
    if (discountType === "fixed" && discountValue <= 0) {
      return res.json({ success: false, message: "Gia tri giam gia phai lon hon 0" });
    }

    const existing = await couponModel.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.json({ success: false, message: "Ma giam gia da ton tai" });
    }

    const coupon = new couponModel({
      code,
      discountType,
      discountValue,
      minimumOrderValue: minimumOrderValue || 0,
      usageLimit: usageLimit || null,
      expiryDate: expiryDate || null,
      usageCount: 0,
    });
    await coupon.save();
    res.json({ success: true, message: "Tao ma giam gia thanh cong" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Loi server" });
  }
};

const listCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Loi server" });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await couponModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Da xoa ma giam gia" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Loi server" });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await couponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.json({ success: false, message: "Ma giam gia khong hop le" });
    }

    if (coupon.expiryDate && Date.now() > new Date(coupon.expiryDate).getTime()) {
      return res.json({ success: false, message: "Ma giam gia da het han" });
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return res.json({ success: false, message: "Ma giam gia da het luot su dung" });
    }

    if (cartTotal < coupon.minimumOrderValue) {
      return res.json({ success: false, message: "Don hang chua dat gia tri toi thieu de ap dung ma" });
    }

    let discountAmount;
    if (coupon.discountType === "percent") {
      discountAmount = Math.floor(cartTotal * coupon.discountValue / 100);
    } else {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Loi server" });
  }
};

export { createCoupon, listCoupons, deleteCoupon, validateCoupon };
