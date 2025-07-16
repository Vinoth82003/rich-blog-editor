import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { getUserFromToken } from "@/lib/authMiddleware";

export async function GET(req, { params }) {
  const { userId } = getUserFromToken();
  await connectDB();

  const blog = await Blog.findOne({
    _id: params.id,
    author: userId,
  });

  if (!blog) {
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    );
  }

  return NextResponse.json(blog);
}

export async function PUT(req, { params }) {
  const { userId } = getUserFromToken();
  await connectDB();

  const updates = await req.json();
  const blog = await Blog.findOneAndUpdate(
    { _id: params.id, author: userId },
    updates,
    { new: true }
  );
  if (!blog)
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    );
  return NextResponse.json(blog);
}

export async function PATCH(req, { params }) {
  const { userId } = await getUserFromToken(req);
  await connectDB();

  const blog = await Blog.findOne({ _id: params.id, author: userId });

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  // Toggle the status
  const newStatus = blog.status === "published" ? "draft" : "published";

  blog.status = newStatus;
  await blog.save();
  const blogs = await Blog.find({ author: userId });

  return NextResponse.json({
    message: `Blog status updated to ${newStatus}`,
    status: newStatus,
    blogs,
  });
}

export async function DELETE(req, { params }) {
  const { userId } = getUserFromToken();
  await connectDB();

  const deleted = await Blog.findOneAndDelete({
    _id: params.id,
    author: userId,
  });
  if (!deleted)
    return NextResponse.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    );
  return NextResponse.json({ message: "Deleted" });
}
