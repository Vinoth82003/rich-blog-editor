"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { fetchWithAuth } from "@/lib/auth/client";
import styles from "@/styles/BlogList.module.css";
import { motion } from "framer-motion";

const tabs = ["all", "draft", "published"];

export default function BlogList() {
  const [blogs, setBlogs] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (status = "all") => {
    try {
      setLoading(true);
      const query = status !== "all" ? `?status=${status}` : "";
      const res = await fetchWithAuth(`/api/blogs${query}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch blogs");
      }
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong while fetching blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(filter);
  }, [filter]);

  const deleteBlog = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#555",
      confirmButtonText: "Yes, delete it!",
      background: "var(--card-bg)",
      color: "var(--text)",
    });

    if (result.isConfirmed) {
      const toastId = toast.loading("Deleting blog...");
      const res = await fetchWithAuth(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((b) => b.filter((x) => x._id !== id));
        toast.success("Blog deleted!");
      } else {
        toast.error("Failed to delete");
      }
      toast.dismiss(toastId);
    }
  };

  const toggleStatus = async (id) => {
    const toastId = toast.loading("Changing blog status...");
    const res = await fetchWithAuth(`/api/blogs/${id}`, { method: "PATCH" });
    const data = await res.json();
    setBlogs(data.blogs);
    toast.success(data.message);
    toast.dismiss(toastId);
  };

  const highlight = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(
      regex,
      `<mark style="background: yellow; color: black; border-radius: 4px;">$1</mark>`
    );
  };

  const filteredBlogs = blogs?.filter((blog) =>
    searchTerm
      ? blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`${styles.tabButton} ${
              filter === tab ? styles.activeTab : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Search */}
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search by title or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Blog List */}
      {loading ? (
        <Spinner size={20} />
      ) : filteredBlogs && filteredBlogs.length > 0 ? (
        <div className={styles.blogList}>
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={{
                ...blog,
                title: highlight(blog.title),
                description: highlight(blog.description || ""),
              }}
              onDelete={deleteBlog}
              onStatusChange={toggleStatus}
              isHighlighted={!!searchTerm}
            />
          ))}
        </div>
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
}
