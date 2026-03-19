import axios from 'axios';
import crypto from 'crypto';

/**
 * Tạo một yêu cầu thanh toán đến MoMo.
 * @param {object} options
 * @param {string} options.orderId - Mã đơn hàng duy nhất.
 * @param {number} options.amount - Số tiền cần thanh toán.
 * @param {string} options.orderInfo - Thông tin đơn hàng.
 * @param {string} options.redirectUrl - URL để MoMo chuyển hướng người dùng sau khi thanh toán xong.
 * @param {string} options.ipnUrl - URL để MoMo gửi thông báo kết quả giao dịch (Instant Payment Notification).
 * @returns {Promise<any>} Dữ liệu phản hồi từ MoMo, chứa payUrl.
 */
export async function createMoMoPayment({ orderId, amount, orderInfo, redirectUrl, ipnUrl }) {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const requestId = `${partnerCode}${Date.now()}`;
  const requestType = 'payWithMethod';
  const extraData = ''; // Dữ liệu bổ sung, có thể để trống

  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`,
  ].join('&');

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode, accessKey, requestId, amount, orderId,
    orderInfo, redirectUrl, ipnUrl, signature,
    requestType,
    extraData,
    lang: 'vi',
  };

  const { data } = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);

  return data; // data.payUrl → chuyển hướng người dùng đến đây
}