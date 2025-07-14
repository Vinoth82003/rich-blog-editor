// /app/api/auth/apikey/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/authMiddleware";
import { generateApiKey, encryptApiKey } from "@/lib/apiKeyUtil";

export async function POST(req) {
  await connectDB();
  const { userId } = await getUserFromToken(req);
  const rawKey = generateApiKey();
  const encrypted = encryptApiKey(rawKey);

  await User.findByIdAndUpdate(userId, { apiKey: encrypted });

  return NextResponse.json({ apiKey: rawKey }); // show raw once
}

export async function DELETE(req) {
  await connectDB();
  const { userId } = await getUserFromToken(req);

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.apiKey = "";
  await user.save();

  return NextResponse.json({ success: true });
}
