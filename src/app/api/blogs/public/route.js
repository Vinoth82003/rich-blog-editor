// /app/api/blogs/public/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import "@/models/User";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 6;
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    Blog.find({ status: "published" })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments({ status: "published" }),
  ]);

  return NextResponse.json({
    blogs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
