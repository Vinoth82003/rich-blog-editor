import styles from "../styles/Landing.module.css";
import { motion } from "framer-motion";
import { Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1>
        <Sparkles size={36} /> Create, Preview & Publish Your <span>Blog</span>
      </h1>
      <p>Your powerful space to write, design, and manage stories.</p>
      <div className={styles.buttons}>
        <Link href="/signup" className={styles.cta}>
          Get Started
        </Link>
        <Link href="/blog" className={styles.secondary}>
          <BookOpen size={18} style={{ marginRight: "6px" }} />
          Read Blogs
        </Link>
      </div>
    </motion.section>
  );
}
