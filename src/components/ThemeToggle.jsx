"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        color: "var(--text)",
        padding: "6px 12px",
        borderRadius: 10,
        cursor: "pointer",
      }}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
