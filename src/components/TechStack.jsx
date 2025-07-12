"use client";
import styles from "../styles/Landing.module.css";
import { motion } from "framer-motion";
import { Rocket, Code2, Feather, ShieldCheck, Zap } from "lucide-react";

const stackItems = [
  {
    icon: <Code2 size={26} />,
    title: "Powered by Next.js + React",
    description: "Blazing fast performance and built-in SEO benefits.",
  },
  {
    icon: <Feather size={26} />,
    title: "Rich Markdown Editor",
    description: "Create beautifully formatted posts using TipTap.",
  },
  {
    icon: <Zap size={26} />,
    title: "Real-time Preview",
    description: "See your blog updates instantly before publishing.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Secure by Design",
    description: "Data encrypted with token-based access & JWT.",
  },
  {
    icon: <Rocket size={26} />,
    title: "Deployed on Vercel",
    description: "Global CDN, instant scaling, and fast deploys.",
  },
];

export default function TechStack() {
  return (
    <section className={styles.techStack}>
      <h2 className={styles.sectionTitle}>Tech Stack & Benefits</h2>
      <div className={styles.stackGrid}>
        {stackItems.map((item, index) => (
          <motion.div
            key={index}
            className={styles.stackCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className={styles.stackIcon}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
