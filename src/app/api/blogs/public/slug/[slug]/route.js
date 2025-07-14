import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { encryptApiKey } from "@/lib/apiKeyUtil";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization header" },
        { status: 401, headers: corsHeaders }
      );
    }

    const apiKey = authHeader.split(" ")[1];
    const encKey = await encryptApiKey(apiKey);
    const user = await User.findOne({ apiKey: encKey });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API key" },
        { status: 403, headers: corsHeaders }
      );
    }

    const blog = await Blog.findOne({
      slug: params.slug,
      status: "published",
    }).populate("author", "name -_id");

    if (!blog) {
      return NextResponse.json(
        { error: "Published blog not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(blog, { headers: corsHeaders });
  } catch (error) {
    console.error("GET /api/blogs/public/slug/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
