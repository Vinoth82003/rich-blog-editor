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
    subject: "Reset your password",
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
  });

  console.log("Email sent: ", info.messageId);
};
