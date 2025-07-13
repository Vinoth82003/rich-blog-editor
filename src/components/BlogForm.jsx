"use client";

import { useState } from "react";
import BlogDetails from "./BlogDetails";
import BlogEditor from "./BlogEditor";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";

export default function BlogForm({ blogId }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    bannerUrl: "",
    readTime: "",
    status: "draft",
  });

  const submit = async () => {
    const method = blogId ? "PUT" : "POST";
    const url = blogId ? `/api/blogs/${blogId}` : "/api/blogs";

    const res = await fetch(url, {
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
  };

  if (step === 1)
    return (
      <BlogDetails form={form} setForm={setForm} onNext={() => setStep(2)} />
    );

  return (
    <BlogEditor
      content={form.content}
      setContent={(c) => setForm({ ...form, content: c })}
      onBack={() => setStep(1)}
      onSubmit={submit}
    />
  );
}
