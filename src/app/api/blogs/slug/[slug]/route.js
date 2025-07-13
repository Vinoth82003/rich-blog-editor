import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(req, { params }) {
  await connectDB();
  const blog = await Blog.findOne({ slug: params.slug, status: "published" });
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(blog);
}
