// src/models/Blog.js
import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: String,
    bannerUrl: String,
    readTime: String,
    status: { type: String, enum: ["draft", "published"], default: "draft" },

    // Slug for URLs
    slug: { type: String, unique: true },

    // SEO Metadata
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String, // comma-separated
    canonicalUrl: String,

    // Author & engagement
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Auto-generate unique slug from title
blogSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
