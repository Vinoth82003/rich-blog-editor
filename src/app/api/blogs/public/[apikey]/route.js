// /app/api/public/[apikey]/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Blog from "@/models/Blog";
import { decryptApiKey } from "@/lib/apiKeyUtil";
import { rateLimiter } from "@/lib/rateLimiter";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req, { params }) {
  const { apikey } = params;

  if (!apikey) {
    return NextResponse.json(
      { error: "No API key provided" },
      { status: 400, headers: corsHeaders }
    );
  }

  const clientIP = req.headers.get("x-forwarded-for") || "global";
  try {
    await rateLimiter.consume(clientIP);
  } catch {
    return NextResponse.json(
      { error: "Too Many Requests" },
      { status: 429, headers: corsHeaders }
    );
  }

  await connectDB();
  const users = await User.find({ apiKey: { $ne: null } }).lean();

  const matched = users.find((u) => {
    try {
      const rawKey = decryptApiKey(u.apiKey);
      return rawKey === apikey;
    } catch {
      return false;
    }
  });

  if (!matched) {
    return NextResponse.json(
      { error: "Invalid API Key" },
      { status: 401, headers: corsHeaders }
    );
  }

  const blogs = await Blog.find({ author: matched._id })
    .select(
      "title description content createdAt updatedAt slug readTime bannerUrl"
    )
    .sort({ createdAt: -1 });

  return NextResponse.json(blogs, { headers: corsHeaders });
}
