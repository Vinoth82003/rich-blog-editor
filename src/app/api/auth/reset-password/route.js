// app/api/auth/reset-password/route.js

import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || password.length < 6) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const found = await Otp.findOne({email})

  if (!found.isVerified) {
    return NextResponse.json({ error: "OTP not Verified" }, { status: 401 });

  }

  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Password reset failed" },
      { status: 500 }
    );
  }
}
