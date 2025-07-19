// /api/blogs/slug/[slug]/view.js
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB();

  // Validate slug
  const { slug } = params;
  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  // Increment view count atomically
  const blog = await Blog.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true } // return updated document
  );

  console.log("blog: ", blog);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ views: blog.views });
}
