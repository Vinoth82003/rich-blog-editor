import styles from "../styles/BlogCard.module.css";
import {
  ArrowRightLeftIcon,
  Clock,
  Edit2,
  EyeIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogCard({
  blog,
  onDelete,
  onStatusChange,
  isHighlighted,
}) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.015, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {blog.bannerUrl && <img src={blog.bannerUrl} className={styles.banner} />}
      <div className={styles.details}>
        {/* Highlighted Title */}
        <h3>
          {isHighlighted ? (
            <span dangerouslySetInnerHTML={{ __html: blog.title }} />
          ) : (
            blog.title
          )}
        </h3>

        {/* Highlighted Description */}
        <p>
          {isHighlighted ? (
            <span dangerouslySetInnerHTML={{ __html: blog.description }} />
          ) : (
            blog.description
          )}
        </p>

        {/* Meta Info */}
        <div className={styles.meta}>
          <span className={styles.status}>{blog.status}</span>
          <span>
            <Clock size={14} /> {blog.readTime} min
          </span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          {blog.status === "published" && (
            <Link
              href={`/blogs/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewLink}
            >
              <EyeIcon size={16} />
            </Link>
          )}
          <Link href={`/dashboard/${blog._id}/edit`}>
            <Edit2 size={16} />
          </Link>
          <button onClick={() => onStatusChange(blog._id)}>
            <ArrowRightLeftIcon size={16} />
          </button>
          <button onClick={() => onDelete(blog._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
