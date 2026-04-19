import crypto from "crypto";
import querystring from "querystring";

/**
 * Sắp xếp object theo key và build query string chuẩn VNPay
 */
function sortObject(obj) {
    const sorted = {};
    Object.keys(obj)
        .sort()
        .forEach((key) => {
            sorted[key] = obj[key];
        });
    return sorted;
}

/**
 * Tạo URL thanh toán VNPay
 * @param {object} params
 * @param {string} params.orderId
 * @param {number} params.amount  - số tiền (VND, chưa nhân 100)
 * @param {string} params.orderInfo
 * @param {string} params.ipAddr
 * @param {string} params.returnUrl
 */
export function createVnpayUrl({ orderId, amount, orderInfo, ipAddr, returnUrl }) {
    const tmnCode   = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const vnpUrl    = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    const date = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const createDate =
        `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
        `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

    let params = {
        vnp_Version:    "2.1.0",
        vnp_Command:    "pay",
        vnp_TmnCode:    tmnCode,
        vnp_Locale:     "vn",
        vnp_CurrCode:   "VND",
        vnp_TxnRef:     String(orderId),
        vnp_OrderInfo:  orderInfo,
        vnp_OrderType:  "other",
        vnp_Amount:     amount * 100,   // VNPay yêu cầu nhân 100
        vnp_ReturnUrl:  returnUrl,
        vnp_IpAddr:     ipAddr,
        vnp_CreateDate: createDate,
    };

    params = sortObject(params);

    const signData = querystring.stringify(params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    params["vnp_SecureHash"] = signed;

    return `${vnpUrl}?${querystring.stringify(params, { encode: false })}`;
}

/**
 * Xác thực chữ ký callback từ VNPay
 * @param {object} query - req.query từ VNPay return URL
 * @returns {boolean}
 */
export function verifyVnpayReturn(query) {
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const secureHash = query["vnp_SecureHash"];

    const params = { ...query };
    delete params["vnp_SecureHash"];
    delete params["vnp_SecureHashType"];

    const sorted = sortObject(params);
    const signData = querystring.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return secureHash === signed;
}
