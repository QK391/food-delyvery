// Run: npm install mailtrap in food-del/backend
import { MailtrapClient } from "mailtrap";

const client = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });

const sender = {
  email: "hello@demomailtrap.co",
  name: "Food Delivery",
};

export const sendResetEmail = async (toEmail, resetUrl) => {
  await client.send({
    from: sender,
    to: [{ email: toEmail }],
    subject: "Dat lai mat khau",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">Dat lai mat khau</h2>
        <p>Ban da yeu cau dat lai mat khau. Nhan vao nut ben duoi de tiep tuc:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#e74c3c;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">
          Dat lai mat khau
        </a>
        <p style="color:#888;font-size:13px;">Link nay se het han sau <strong>1 gio</strong>.</p>
        <p style="color:#888;font-size:13px;">Neu ban khong yeu cau, hay bo qua email nay.</p>
      </div>
    `,
    category: "Password Reset",
  });
};
