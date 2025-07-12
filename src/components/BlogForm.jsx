"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import styles from "../styles/BlogForm.module.css";

export default function BlogForm({ blogId }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    bannerUrl: "",
    readTime: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetch(`/api/blogs/${blogId}`)
        .then(async (r) => {
          if (!r.ok) {
            throw new Error("Failed to fetch blog");
          }

          const text = await r.text();
          if (!text) {
            throw new Error("Empty response from server");
          }

          const data = JSON.parse(text);
          setForm({
            title: data.title || "",
            description: data.description || "",
            content: data.content || "",
            bannerUrl: data.bannerUrl || "",
            readTime: data.readTime || "",
            status: data.status || "draft",
          });
        })
        .catch((err) => {
          console.error("Fetch error:", err.message);
          toast.error("Failed to load blog data");
        });
    }
  }, [blogId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    const method = blogId ? "PUT" : "POST";
    const url = blogId ? `/api/blogs/${blogId}` : "/api/blogs";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) toast.error("Failed to save blog");
    else {
      toast.success(blogId ? "Blog updated" : "Blog created");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className={styles.formContainer}>
      <h2>{blogId ? "Edit Blog" : "New Blog"}</h2>
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} />
      </label>
      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Banner URL
        <input
          name="bannerUrl"
          value={form.bannerUrl}
          onChange={handleChange}
        />
      </label>
      <label>
        Read Time (minutes)
        <input
          name="readTime"
          type="number"
          value={form.readTime}
          onChange={handleChange}
        />
      </label>
      <label>
        Content
        <textarea name="content" value={form.content} onChange={handleChange} />
      </label>
      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <button onClick={submit} disabled={loading}>
        {loading ? <Spinner /> : blogId ? "Update" : "Create"}
      </button>
    </div>
  );
}
