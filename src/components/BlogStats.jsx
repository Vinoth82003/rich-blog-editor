"use client";
import { useEffect } from "react";
import { Eye, ThumbsUp } from "lucide-react";
import { shouldTrackView } from "../../utils/viewTracker";
import styles from "../styles/BlogStats.module.css";

function BlogStats({ slug, views, likes }) {
  useEffect(() => {
    if (shouldTrackView(slug)) {
      fetch(`/api/blogs/slug/${slug}/view`, {
        method: "POST",
      }).catch(console.error);
    }
  }, [slug]);

  return (
    <div className={styles.statsWrapper}>
      <div className={styles.statItem}>
        <Eye size={18} />
        <span>{views?.toLocaleString() || 0} views</span>
      </div>
      <div className={styles.statItem}>
        <ThumbsUp size={18} />
        <span>{likes ?? 0} likes</span>
      </div>
    </div>
  );
}

export default BlogStats;
