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
  MenuIcon,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/signin");
  };

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
            href="/dashboard/drafts"
            className={pathname === "/dashboard/drafts" ? styles.active : ""}
          >
            <FileText /> Drafts
          </Link>
          <Link
            href="/dashboard/published"
            className={pathname === "/dashboard/published" ? styles.active : ""}
          >
            <CheckCircle2 /> Published
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
