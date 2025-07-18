"use client";

import styles from "@/styles/BlogListPage.module.css";
import Link from "next/link";
import { User, Calendar, Clock, BookOpen, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Footer from "@/components/Footer/Footer";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/blogs/public?page=${page}&limit=6`);
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const { blogs, totalPages } = await res.json();

        const formatted = blogs.map((b) => ({
          _id: b._id,
          title: b.title,
          description: b.description,
          bannerUrl: b.bannerUrl,
          slug: b.slug,
          readTime: b.readTime || "3 min",
          author: b.author?.name || "Unknown",
          createdAt: new Date(b.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));

        setBlogs(formatted);
        setTotalPages(totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [page]);

  return (
    <div className={styles.blogsWrapper}>
      <h1 className={styles.title}>
        <BookOpen size={26} className={styles.icon} />
        All Published Blogs
      </h1>

      {loading ? (
        <div
          style={{
            marginTop: "3rem",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <Spinner />
          <p>Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No blogs found.
        </p>
      ) : (
        <div className={styles.grid}>
          {blogs.map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog._id}
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              {blog.bannerUrl && (
                <div className={styles.imageWrapper}>
                  <img
                    src={blog.bannerUrl}
                    alt={blog.title}
                    className={styles.banner}
                    loading="lazy"
                  />
                </div>
              )}
              <div className={styles.content}>
                <h2 className={styles.blogTitle}>{blog.title}</h2>
                <p className={styles.description}>{blog.description}</p>
                <div className={styles.meta}>
                  <span>
                    <User size={16} /> {blog.author}
                  </span>
                  <span>
                    <Calendar size={16} /> {blog.createdAt}
                  </span>
                  <span>
                    <Clock size={16} /> {blog.readTime} min read
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
