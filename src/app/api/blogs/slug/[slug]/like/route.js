import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { getUserFromToken } from "@/lib/authMiddleware";

export async function POST(req, { params }) {
  await connectDB();

  try {
    const user = await getUserFromToken(req);
    // console.log(
    //   "\n\n-------------\nuser: ",
    //   user,
    //   "\n----------------------\n\n"
    // );

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const blog = await Blog.findOne({ slug: params.slug });
    if (!blog)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const alreadyLiked = blog.likes.includes(user.userId);

    if (alreadyLiked) {
      blog.likes.pull(user.userId);
    } else {
      blog.likes.push(user.userId);
    }

    await blog.save();

    return NextResponse.json({
      liked: !alreadyLiked,
      totalLikes: blog.likes.length,
    });
  } catch (error) {
    console.error("[LIKE_BLOG_ERROR]", error);
    if (error == "Error: No token") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
