// app/api/auth/verify-otp/route.js

import { verifyOTP } from "@/lib/otpStore";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, otp } = await req.json();
  const isValid = await verifyOTP(email, otp);

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid or expired OTP" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
