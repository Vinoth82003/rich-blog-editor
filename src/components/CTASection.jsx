import styles from "../styles/Landing.module.css";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <motion.section
      className={styles.ctaSection}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2>Start Writing. Start Sharing.</h2>
      <Link href="/signup" className={styles.cta}>
        Sign Up Now
      </Link>
    </motion.section>
  );
}
