"use client";
import { fetchWithAuth } from "@/lib/auth/client";
import styles from "../styles/BlogFooter.module.css";
import {
  Facebook,
  Linkedin,
  Twitter,
  Copy,
  ThumbsUp,
  Share2,
  Send,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";

export default function BlogFooter({ slug, likes }) {
  const [liked, setLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likes);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const blogUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/blogs/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(blogUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleLike = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetchWithAuth(`/api/blogs/slug/${slug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Unauthorized") {
          toast.error("Please log in to like the post.");
          router.push("/signin");
          return;
        }
        throw new Error(data.message || "Failed to like");
      }

      toast.success(`${data.liked ? "Liked" : "Disliked"}`);

      setLiked(data.liked);
      setTotalLikes(data.totalLikes);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={styles.blogFooter}>
      <button
        className={`${styles.iconButton} ${liked ? styles.liked : ""}`}
        onClick={handleLike}
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner /> Liking...
          </>
        ) : (
          <>
            <ThumbsUp size={20} />
            {liked ? "Liked" : "Like"}
            {totalLikes > 0 && ` ${totalLikes} Likes`}
          </>
        )}
      </button>

      <button className={styles.iconButton} onClick={handleCopy}>
        <Copy size={20} />
        Copy Link
      </button>

      <button
        className={styles.iconButton}
        onClick={() => setShowShare(!showShare)}
      >
        <Share2 size={20} />
        Share
      </button>

      {showShare && (
        <div className={styles.shareOptions}>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              blogUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareBtn}
          >
            <Send size={18} />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              blogUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareBtn}
          >
            <Facebook size={18} />
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              blogUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareBtn}
          >
            <Twitter size={18} />X (Twitter)
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              blogUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareBtn}
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      )}
    </footer>
  );
}
