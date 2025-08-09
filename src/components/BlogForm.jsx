"use client";

import { useState, useEffect } from "react";
import BlogDetails from "./BlogDetails";
import BlogEditor from "./BlogEditor";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth/client";

export default function BlogForm({ blogId }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(!!blogId); // only load if editing
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    bannerUrl: "",
    readTime: "",
    status: "draft",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
  });

  // Fetch blog if blogId is given
  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        const res = await fetchWithAuth(`/api/blogs/${blogId}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();

        setForm({
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          bannerUrl: data.bannerUrl || "",
          readTime: data.readTime || "",
          status: data.status || "draft",
          slug: data.slug || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          metaKeywords: data.metaKeywords || "",
          canonicalUrl: data.canonicalUrl || "",
        });
      } catch (err) {
        toast.error(err.message || "Error loading blog");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const submit = async () => {
    setLoading(true);
    const method = blogId ? "PUT" : "POST";
    const url = blogId ? `/api/blogs/${blogId}` : "/api/blogs";

    const res = await fetchWithAuth(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      toast.error("Failed to save blog");
    } else {
      toast.success(blogId ? "Updated" : "Created");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ marginTop: "4rem", textAlign: "center" }}>
        <Spinner />
      </div>
    );
  }

  if (step === 1) {
    return (
      <BlogDetails
        form={form}
        setForm={setForm}
        onNext={() => setStep(2)}
        showMetadata={true} // pass flag to show metadata fields
      />
    );
  }

  return (
    <BlogEditor
      content={form.content}
      setContent={(c) => setForm({ ...form, content: c })}
      onBack={() => setStep(1)}
      onSubmit={submit}
      loading={loading}
    />
  );
}
