"use client";
import styles from "../styles/Dashboard.module.css";
import { LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>📝 MyBlog</h2>
        <nav>
          <Link href="/dashboard">
            <LayoutDashboard /> Dashboard
          </Link>
          <Link href="/dashboard/drafts">
            <FileText /> Drafts
          </Link>
          <Link href="/dashboard/published">
            <FileText /> Published
          </Link>
          <Link href="/dashboard/settings">
            <Settings /> Settings
          </Link>
        </nav>
        <button className={styles.logout}>
          <LogOut /> Logout
        </button>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
