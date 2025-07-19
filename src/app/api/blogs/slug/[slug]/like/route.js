import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { getUserFromToken } from "@/lib/authMiddleware";

export async function POST(req, { params }) {
  await connectDB();

  const user = await getUserFromToken(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blog = await Blog.findOne({ slug: params.slug });
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const alreadyLiked = blog.likes.includes(user._id);

  if (alreadyLiked) {
    blog.likes.pull(user._id);
  } else {
    blog.likes.push(user._id);
  }

  await blog.save();

  return NextResponse.json({
    liked: !alreadyLiked,
    totalLikes: blog.likes.length,
  });
}
