"use client";

import { useState, useEffect } from "react";
import BlogDetails from "./BlogDetails";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth/client";
import dynamic from "next/dynamic";

// Dynamically import BlogEditor to avoid SSR issues
const DynamicBlogEditor = dynamic(
  () => import("./BlogEditor"),
  {
    ssr: false,
    loading: () => <Spinner />
  }
);

export default function BlogForm({ blogId }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(!!blogId);
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
  }, [blogId, router]);

  const submit = async () => {
    setLoading(true);
    const method = blogId ? "PUT" : "POST";
    const url = blogId ? `/api/blogs/${blogId}` : "/api/blogs";

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success(blogId ? "Blog updated!" : "Blog created!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  if (step === 1) {
    return (
      <BlogDetails
        form={form}
        setForm={setForm}
        onNext={() => setStep(2)}
        showMetadata={true}
      />
    );
  }

  return (
    <DynamicBlogEditor
      content={form.content}
      setContent={(c) => setForm({ ...form, content: c })}
      onBack={() => setStep(1)}
      onSubmit={submit}
      loading={loading}
    />
  );
}