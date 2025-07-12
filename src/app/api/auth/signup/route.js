import { NextResponse } from "next/server";
import User from "@/models/User";
import { hashPassword } from "@/lib/hash";
import connectDB from "@/lib/db";

export async function POST(req) {
  await connectDB();
  const { name, email, password, profileImage } = await req.json();

  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashed = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashed,
    profileImage,
  });

  return NextResponse.json({ message: "Signup successful", userId: user._id });
}
