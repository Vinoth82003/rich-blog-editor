"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/Dashboard.module.css";
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  Settings,
  LogOut,
  FilePenIcon,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/signin");
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>📝 MyBlog</h2>
        <nav>
          <Link href="/dashboard">
            <LayoutDashboard /> Overview
          </Link>
          <Link href="/dashboard/create">
            <FilePenIcon /> Create
          </Link>
          <Link href="/dashboard/drafts">
            <FileText /> Drafts
          </Link>
          <Link href="/dashboard/published">
            <CheckCircle2 /> Published
          </Link>
          <Link href="/dashboard/settings">
            <Settings /> Settings
          </Link>
        </nav>
        <button className={styles.logout} onClick={handleLogout}>
          <LogOut /> Logout
        </button>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
