// app/api/upload/route.js
import { writeFile } from "fs/promises";
import path from "path";
import slugify from "slugify";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // input name="file"

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract original name without extension
    const originalName = file.name.split(".").slice(0, -1).join(".") || "file";
    const ext = path.extname(file.name);

    // Generate safe file name with timestamp
    const timestamp = Date.now(); // or you can use new Date().toISOString().replace(/[:.]/g, "-")
    const safeName = `${slugify(originalName, {
      lower: true,
      strict: true,
    })}-${timestamp}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, safeName);

    await writeFile(filePath, buffer);

    return new Response(
      JSON.stringify({ success: true, path: `/uploads/${safeName}` }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
