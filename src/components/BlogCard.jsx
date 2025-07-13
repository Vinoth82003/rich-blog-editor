import styles from "../styles/BlogCard.module.css";
import { Clock, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import Spinner from "./Spinner";

export default function BlogCard({ blog, onDelete }) {
  return (
    <div className={styles.card}>
      {blog.bannerUrl && <img src={blog.bannerUrl} className={styles.banner} />}
      <div className={styles.details}>
        <h3>{blog.title}</h3>
        <p>{blog.description}</p>
        <div className={styles.meta}>
          <span className={styles.status}>{blog.status}</span>
          <span>
            <Clock size={14} /> {blog.readTime} min
          </span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <div className={styles.actions}>
          <Link href={`/dashboard/${blog._id}/edit`}>
            {<Edit2 size={16} />}
          </Link>
          <button onClick={() => onDelete(blog._id)}>
            {<Trash2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
