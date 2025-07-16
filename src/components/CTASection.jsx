"use client";
import styles from "../styles/Landing.module.css";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";

export default function CTASection() {
  return (
    <motion.section
      className={styles.ctaSection}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className={styles.ctaInner}>
        <h1>
          ✍️ Start <span>Writing</span>, Start <span>Sharing</span>.
        </h1>
        <p>
          Create, manage, and publish your blogs in one place — fast, secure,
          and beautiful.
        </p>
        <Link href="/signup" className={styles.link}>
          Sign Up Now <ArrowRightCircle size={20} />
        </Link>
      </div>
    </motion.section>
  );
}
