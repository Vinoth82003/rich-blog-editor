// /app/api/blogs/public/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import "@/models/User"; 

export async function GET() {
  await connectDB();

  const blogs = await Blog.find({ status: "published" })
    .populate("author", "name") 
    .sort({ createdAt: -1 });

  return NextResponse.json(blogs);
}
