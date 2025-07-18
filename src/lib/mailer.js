// lib/mailer.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  const info = await transporter.sendMail({
    from: `"Blog Support Team" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Reset Your Password - OTP Inside",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">🔐 Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">Hi there,</p>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your password. Use the OTP below to continue:
        </p>
        <div style="margin: 24px 0; padding: 16px; background-color: #fff; border: 1px dashed #4f46e5; border-radius: 6px; text-align: center;">
          <p style="font-size: 18px; color: #333; margin: 0;">Your OTP:</p>
          <p style="font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 4px; margin: 12px 0;">${otp}</p>
        </div>
        <p style="font-size: 14px; color: #888;">
          This OTP is valid for <strong>5 minutes</strong>. If you didn’t request this, you can safely ignore this email.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          — Blog Support Team
        </p>
      </div>
    `,
  });

  console.log("Email sent: ", info.messageId);
};
