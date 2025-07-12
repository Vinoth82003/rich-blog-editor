"use client";
import { useEffect, useState } from "react";
import styles from "../styles/Loader.module.css";
import Spinner from "./Spinner";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!loading) return null;

  return (
    <div className={styles.pageOverlay}>
      <Spinner size={28} />
    </div>
  );
}
