"use client";
import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Spinner from "./Spinner";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with real API
    const fetchBlogs = async () => {
      await new Promise((r) => setTimeout(r, 1000)); // fake delay
      setBlogs([
        {
          title: "React Suspense Deep Dive",
          desc: "An in-depth guide to Suspense in React...",
          banner: "/sample.jpg",
          readTime: 4,
          status: "Draft",
          createdAt: "2024-06-01",
        },
        {
          title: "Deploying Next.js to Vercel",
          desc: "How to deploy your Next app seamlessly...",
          banner: "/sample2.jpg",
          readTime: 3,
          status: "Published",
          createdAt: "2024-05-10",
        },
      ]);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      {blogs.map((blog, i) => (
        <BlogCard key={i} {...blog} />
      ))}
    </>
  );
}
