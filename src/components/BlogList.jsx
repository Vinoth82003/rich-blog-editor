"use client";
import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function BlogList({ filter }) {
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `/api/blogs${filter ? `?status=${filter}` : ""}`
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch blogs");
        }

        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Something went wrong while fetching blogs");
        setBlogs([]); // fallback to empty list to avoid infinite spinner
      }
    };

    fetchBlogs();
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
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((b) => b.filter((x) => x._id !== id));
        toast.success("Blog deleted!");
      } else {
        toast.error("Failed to delete");
      }
      toast.dismiss(toastId);
    }
  };

  if (blogs === null) return <Spinner size={20} />;
  if (!blogs.length) return <p>No blogs found.</p>;

  return blogs.map((b) => (
    <BlogCard key={b._id} blog={b} onDelete={deleteBlog} />
  ));
}
