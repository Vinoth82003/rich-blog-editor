// POST: create new blog
// GET: fetch all blogs by current user
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import "@/models/User";
import { getUserFromToken } from "@/lib/authMiddleware";

export async function POST(req) {
  await connectDB();

  let userId;
  try {
    const user = await getUserFromToken(req);
    userId = user.userId;
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized. Invalid or missing token." },
      { status: 401 }
    );
  }

  // Extract blog fields from request body
  const {
    title,
    description,
    content,
    bannerUrl,
    readTime,
    status,
    metaTitle,
    metaDescription,
    metaKeywords,
    canonicalUrl,
  } = await req.json();

  try {
    const blog = await Blog.create({
      author: userId,
      title,
      description,
      content,
      bannerUrl,
      readTime,
      status,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
    });

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create blog" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await connectDB();

  let userId;
  try {
    const user = await getUserFromToken(req);
    userId = user.userId;
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized. Invalid or missing token." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const filter = { author: userId };
  if (status) filter.status = status;

  const blogs = await Blog.find(filter)
    .populate("author", "name")
    .sort({ createdAt: -1 });

  return NextResponse.json(blogs);
}
