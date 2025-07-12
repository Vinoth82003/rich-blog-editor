import styles from "../styles/BlogCard.module.css";
import { Clock } from "lucide-react";

export default function BlogCard({
  title,
  desc,
  banner,
  readTime,
  status,
  createdAt,
}) {
  return (
    <div className={styles.card}>
      <img src={banner} alt="banner" className={styles.banner} />
      <div className={styles.details}>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className={styles.meta}>
          <span className={styles.status}>{status}</span>
          <span className={styles.read}>
            <Clock size={14} /> {readTime} min read
          </span>
          <span className={styles.date}>
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
