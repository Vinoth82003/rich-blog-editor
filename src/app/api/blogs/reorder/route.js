// src/app/api/blogs/reorder/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { getUserFromToken } from "@/lib/authMiddleware";
// import { getAuthUser } from "@/lib/auth";

export async function PUT(request) {
  await dbConnect();
  const user = await getUserFromToken(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { orderedIds } = await request.json(); // array of blog IDs in new order

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      await Blog.findByIdAndUpdate(orderedIds[i], { displayOrder: i + 1 });
    }
    return NextResponse.json({ message: "Order updated successfully" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
