// lib/otpStore.js

import Otp from "@/models/Otp";
import connectDB from "./db";

export async function saveOTP(email, otp) {
  await connectDB();
  await Otp.deleteMany({ email });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const otpDoc = new Otp({ email, otp, expiresAt });
  await otpDoc.save();
}

export async function verifyOTP(email, otp) {
  await connectDB();
  const found = await Otp.findOne({ email });

  if (!found) return false;
  const isValid = found.otp === otp && found.expiresAt > new Date();
  if (isValid) found.isVerified = true;
  await found.save();
  
  return isValid;
}
