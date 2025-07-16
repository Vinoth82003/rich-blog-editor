// POST: create new blog
// GET: fetch all blogs by current user
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import "@/models/User";
import { getUserFromToken } from "@/lib/authMiddleware";

export async function POST(req) {
  const { userId } = getUserFromToken();
  console.log("userId: ", userId);

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
