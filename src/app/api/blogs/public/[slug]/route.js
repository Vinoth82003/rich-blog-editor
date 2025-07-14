// /app/api/blogs/public/[slug]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User"; // Ensure model is registered

export async function GET(req, { params }) {
  try {
    await connectDB();

    const slug = params.slug;
    const authHeader = req.headers.get("authorization");

    // 1. Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or malformed Authorization header" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.split(" ")[1];

    // 2. Find the user by API key
    const user = await User.findOne({ apiKey });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API key" },
        { status: 403 }
      );
    }

    // 3. Find the blog with given slug and published status
    const blog = await Blog.findOne({ slug, status: "published" }).populate(
      "author",
      "name"
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // 4. Return the blog
    return NextResponse.json(blog);
  } catch (error) {
    console.error("GET /api/blogs/public/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
