// app/api/auth/forgot-password/route.js

import { NextResponse } from "next/server";
import { saveOTP } from "@/lib/otpStore";
import { sendOTPEmail } from "@/lib/mailer";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB and send email
    await saveOTP(email, otp);
    await sendOTPEmail(email, otp);

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
