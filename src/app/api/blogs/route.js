// POST: create new blog
// GET: fetch all blogs by current user
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { getUserFromToken } from "@/lib/authMiddleware";

export async function POST(req) {
  const { userId } = getUserFromToken();
  await connectDB();

  const { title, description, content, bannerUrl, readTime } = await req.json();

  const blog = await Blog.create({
    author: userId,
    title,
    description,
    content,
    bannerUrl,
    readTime,
  });
  return NextResponse.json(blog);
}

export async function GET(req) {
  await connectDB();
  const { userId } = await getUserFromToken(req);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // 'draft' | 'published' | null

  const filter = { author: userId };
  if (status) filter.status = status;

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });

  return NextResponse.json(blogs);
}
