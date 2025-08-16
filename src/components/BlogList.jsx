"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { fetchWithAuth } from "@/lib/auth/client";
import styles from "@/styles/BlogList.module.css";
import { motion } from "framer-motion";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const tabs = ["all", "draft", "published"];


function SortableItem({ blog, index, onDelete, onStatusChange, isHighlighted }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: blog._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BlogCard
        blog={blog}
        orderNumber={index + 1}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        isHighlighted={isHighlighted}
      />
    </div>
  );
}


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


  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blogs.findIndex((b) => b._id === active.id);
    const newIndex = blogs.findIndex((b) => b._id === over.id);

    const reordered = arrayMove(blogs, oldIndex, newIndex);
    setBlogs(reordered);

    const toastId = toast.loading("Re-ordering please wait");

    try {
      await fetchWithAuth("/api/blogs/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: reordered.map((b) => b._id) }),
      });
      toast.success("Re-ordered...!");
    } catch (error) {
      toast.error("Re-order failed");
      console.log("[ERROR]: ", error);
    } finally {
      toast.dismiss(toastId)
    }
  };



  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`${styles.tabButton} ${filter === tab ? styles.activeTab : ""
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredBlogs.map((b) => b._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {blogs.map((blog, index) => (
                  <SortableItem
                    key={blog._id}
                    blog={blog}
                    index={index}
                    onDelete={() => console.log("delete", blog._id)}
                    onStatusChange={() => console.log("status", blog._id)}
                    isHighlighted={false}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
}
