"use client";

import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/DashboardHeader";
import BlogTable from "@/components/BlogTable";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("User");
  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState({
    published: null,
    drafts: null,
    total: null,
  });

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/blogs/"); // adjust if needed
      const data = await res.json();
      const published = data.filter((b) => b.status === "published").length;
      const drafts = data.filter((b) => b.status === "draft").length;
      setStats({ published, drafts, total: data.length });
      console.log("data[0].author.name: ", data[0].author.name);
      setUsername(data[0].author.name || "User");
      setBlogs(data);
    }

    fetchData();
  }, []);
  return (
    <DashboardLayout>
      {blogs ? (
        <>
          <DashboardHeader username={username} now={now} stats={stats} />
          <BlogTable blogs={blogs} />
        </>
      ) : (
        <Spinner />
      )}
    </DashboardLayout>
  );
}
