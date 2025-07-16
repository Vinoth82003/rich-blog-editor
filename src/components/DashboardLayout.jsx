"use client";
import Link from "next/link";
import styles from "../styles/Dashboard.module.css";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  FilePenIcon,
  MenuIcon,
  X,
  BookCheckIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { handleLogout } from "@/lib/auth/client";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    <div className={styles.container}>
      <aside
        className={`${styles.sidebar} ${
          isMenuOpen ? styles.open : styles.closed
        }`}
      >
        <h2 className={styles.logo}>📝 MyBlog</h2>
        <nav>
          <Link
            href="/dashboard"
            className={pathname === "/dashboard" ? styles.active : ""}
          >
            <LayoutDashboard /> Overview
          </Link>
          <Link
            href="/dashboard/create"
            className={pathname === "/dashboard/create" ? styles.active : ""}
          >
            <FilePenIcon /> Create
          </Link>
          <Link
            href="/dashboard/blogs"
            className={pathname === "/dashboard/blogs" ? styles.active : ""}
          >
            <BookCheckIcon /> Blogs
          </Link>
          <Link
            href="/dashboard/settings"
            className={pathname === "/dashboard/settings" ? styles.active : ""}
          >
            <Settings /> Settings
          </Link>
        </nav>

        <button className={styles.logout} onClick={handleLogout}>
          <LogOut /> Logout
        </button>
        <button
          type="button"
          className={styles.menuButton}
          onClick={toggleMenu}
        >
          {!isMenuOpen ? <MenuIcon /> : <X />}
        </button>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
