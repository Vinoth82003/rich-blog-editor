// src/models/Blog.js
import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    content: String,
    bannerUrl: String,
    readTime: String,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    slug: { type: String, unique: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

blogSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Check for existing slugs
    while (await mongoose.models.Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
