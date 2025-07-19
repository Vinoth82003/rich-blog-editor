"use client";
import styles from "../styles/BlogFooter.module.css";
import {
  Facebook,
  Linkedin,
  Twitter,
  Copy,
  ThumbsUp,
  Share2,
  Send,
  MessageCircleMore,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BlogFooter({ slug }) {
  const [liked, setLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const blogUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/blogs/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(blogUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <footer className={styles.blogFooter}>
      <button
        className={`${styles.iconButton} ${liked ? styles.liked : ""}`}
        onClick={() => setLiked(!liked)}
      >
        <ThumbsUp size={20} />
        {liked ? "Liked" : "Like"}
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
