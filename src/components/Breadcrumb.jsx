"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import styles from "../styles/Dashboard.module.css";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Clean and extract path segments (ignore 'dashboard')
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => seg !== "dashboard");

  const isIdSegment = (segment) => {
    return !isNaN(segment) || /^[0-9a-fA-F]{24}$/.test(segment);
  };

  const getTitle = (segment) => {
    if (!isNaN(segment)) return `#${segment}`;
    if (/^[0-9a-fA-F]{24}$/.test(segment))
      return `ID: ${segment.slice(0, 6)}...`;
    if (segment === "new") return "Create New";
    if (segment === "edit") return "Edit";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav className={styles.breadcrumb}>
      <Link href="/dashboard" className={styles.link}>
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/dashboard/${segments.slice(0, index + 1).join("/")}`;
        const title = getTitle(segment);
        const isId = isIdSegment(segment);

        return (
          <span key={index} className={styles.segment}>
            <ChevronRight size={16} />

            {isLast || isId ? (
              <span className={styles.active}>{title}</span>
            ) : (
              <Link href={href} className={styles.link}>
                {title}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
