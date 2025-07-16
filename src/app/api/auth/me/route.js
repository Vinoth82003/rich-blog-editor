import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { decryptApiKey } from "@/lib/apiKeyUtil";

async function getUserFromRequest(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    return payload?.userId;
  } catch (e) {
    return null;
  }
}

export async function GET(request) {
  await connectDB();
  const userId = await getUserFromRequest(request);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findById(userId).select("-password");
  user.apiKey = await decryptApiKey(user.apiKey);
  return NextResponse.json(user);
}

export async function PUT(request) {
  await connectDB();
  const userId = await getUserFromRequest(request);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, profileImage } = body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, profileImage },
    { new: true, runValidators: true }
  ).select("-password");

  return NextResponse.json(updatedUser);
}
