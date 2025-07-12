import { NextResponse } from "next/server";
// import {connectDB} from "@/lib/db";
import User from "@/models/User";
import { verifyPassword } from "@/lib/hash";
import { generateToken } from "@/lib/jwt";
import { serialize } from "cookie";
import connectDB from "@/lib/db";

export async function POST(req) {
  await connectDB();
  const { email, password, remember } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid email" }, { status: 401 });

  const valid = await verifyPassword(password, user.password);
  if (!valid)
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });

  const token = generateToken(user._id, remember);

  const cookie = serialize("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: remember ? 7 * 24 * 60 * 60 : 60 * 60, // 7 days or 1 hour
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return new Response(JSON.stringify({ message: "Signed in" }), {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}
