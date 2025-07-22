"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/DashboardHeader";
import BlogTable from "@/components/BlogTable";
import Spinner from "@/components/Spinner";
import AnalyticsChart from "@/components/AnalyticsChart";
import { fetchWithAuth } from "@/lib/auth/client";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [username, setUsername] = useState("User");

  const stats = useMemo(() => {
    const published = blogs.filter((b) => b.status === "published").length;
    const drafts = blogs.filter((b) => b.status === "draft").length;
    return { published, drafts, total: blogs.length };
  }, [blogs]);

  const analytic = useMemo(() => {
    return blogs.map((blog) => ({
      title:
        blog.title.length > 20 ? blog.title.slice(0, 20) + "..." : blog.title,
      views: blog.views || 0,
      likes: blog.likes?.length || 0,
    }));
  }, [blogs]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetchWithAuth("/api/blogs/");
        const data = await res.json();
        setUsername(data[0]?.author?.name || "User");
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs. You may have been logged out.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
        setBlogs((prev) => prev.filter((x) => x._id !== id));
        toast.success("Blog deleted!");
      } else {
        toast.error("Failed to delete");
      }
      toast.dismiss(toastId);
    }
  };

  const toggleStatus = async (id) => {
    setUpdateLoading(true);
    const toastId = toast.loading("Changing blog status...");
    const res = await fetchWithAuth(`/api/blogs/${id}`, { method: "PATCH" });
    const data = await res.json();
    setBlogs(data.blogs);
    toast.success(data.message);
    toast.dismiss(toastId);
    setUpdateLoading(false);
  };

  return (
    <DashboardLayout>
      {!loading && blogs.length > 0 ? (
        <>
          <DashboardHeader username={username} stats={stats} />
          <AnalyticsChart data={analytic} />
          <BlogTable
            blogs={blogs}
            onDelete={deleteBlog}
            onStatusChange={toggleStatus}
            loading={updateLoading}
          />
        </>
      ) : (
        <Spinner />
      )}
    </DashboardLayout>
  );
}
