import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import styles from "@/styles/Blog.module.css";
import { ListCheckIcon } from "lucide-react";
import BlogContentRenderer from "@/components/BlogContentRenderer";
import BlogStats from "@/components/BlogPage";

// Metadata
export async function generateMetadata({ params }) {
  return {
    title: params.slug.replace(/-/g, " ") + " | Blog",
  };
}

// Fetch blog from MongoDB
async function getBlog(slug) {
  await connectDB();
  const blog = await Blog.findOne({ slug, status: "published" }).lean();
  return blog;
}

export default async function BlogPage({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) return notFound();

  const blogWithIds = addHeadingIds(blog.content);
  const toc = generateTOC(blogWithIds);

  return (
    <div className={styles.blogPage}>
      {/* TOC */}
      <aside className={styles.toc}>
        <h3
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ListCheckIcon /> Table of Contents
        </h3>
        <nav dangerouslySetInnerHTML={{ __html: toc.normalize("NFC") }} />
      </aside>

      {/* Blog Content */}
      <main className={styles.blogContent}>
        {blog.bannerUrl && (
          <img
            src={blog.bannerUrl}
            alt="Banner"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "1.5rem",
            }}
          />
        )}
        {blog && <BlogStats slug={params.slug} />}
        {blog && <BlogContentRenderer html={blogWithIds} />}
      </main>
    </div>
  );
}

// Auto add ID to headings
function addHeadingIds(html) {
  return html.replace(/<h([1-4])>(.*?)<\/h\1>/g, (_, level, text) => {
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

// Generate TOC
function generateTOC(html) {
  const headings = html.match(/<h[1-4].*?<\/h[1-4]>/g);
  if (!headings) return "<p>No headings found</p>";

  return `
    <ul style="list-style: none; padding-left: 0;">
      ${headings
        .map((h) => {
          const level = parseInt(h[2]);
          const text = h.replace(/<[^>]+>/g, "");
          const id = text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "");
          return `<li style="margin-left: ${
            (level - 1) * 1.2
          }rem; margin-bottom: 0.5rem;">
            <a href="#${id}" style="text-decoration: none; color: #0070f3;">${text}</a>
          </li>`;
        })
        .join("")}
    </ul>
  `;
}
