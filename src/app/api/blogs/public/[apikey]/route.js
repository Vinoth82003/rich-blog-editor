// /app/api/public/[apikey]/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Blog from "@/models/Blog";
import { decryptApiKey } from "@/lib/apiKeyUtil";

// CORS headers
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
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  await connectDB();
  const users = await User.find({ apiKey: { $ne: null } }).lean();

  const matched = users.find((u) => {
    try {
      const raw = decryptApiKey(u.apiKey);
      return raw === apikey;
    } catch (e) {
      return false;
    }
  });

  if (!matched) {
    return NextResponse.json(
      { error: "Invalid API Key" },
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }

  const blogs = await Blog.find({ author: matched._id, status: "published" })
    .select("title description content createdAt updatedAt slug readTime")
    .sort({ createdAt: -1 });

  return NextResponse.json(blogs, { headers: corsHeaders });
}
