import { notFound } from "next/navigation";

// Generate dynamic metadata (optional SEO support)
export async function generateMetadata({ params }) {
  return {
    title: params.slug.replace(/-/g, " ") + " | Blog",
  };
}

// Fetch blog from server
async function getBlog(slug) {
  const res = await fetch(`/api/blogs/slug/${slug}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPage({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) return notFound();

  const blogWithIds = addHeadingIds(blog.content);
  const toc = generateTOC(blogWithIds);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "2rem",
        gap: "2rem",
      }}
    >
      {/* Sticky Table of Contents */}
      <aside
        style={{
          position: "sticky",
          top: "80px",
          alignSelf: "flex-start",
          width: "250px",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRight: "1px solid #eee",
          paddingRight: "1rem",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>🧭 Table of Contents</h3>
        <nav dangerouslySetInnerHTML={{ __html: toc }} />
      </aside>

      {/* Blog Content */}
      <main style={{ flex: 1, maxWidth: "800px", margin: "0 auto" }}>
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
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          {blog.title}
        </h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          {blog.description}
        </p>

        <div
          dangerouslySetInnerHTML={{ __html: blogWithIds }}
          className="blog-content"
          style={{ lineHeight: 1.7, fontSize: "1.05rem" }}
        />
      </main>
    </div>
  );
}

// ✅ Auto add ID to headings
function addHeadingIds(html) {
  return html.replace(/<h([1-4])>(.*?)<\/h\1>/g, (_, level, text) => {
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

// ✅ Generate TOC from content
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
