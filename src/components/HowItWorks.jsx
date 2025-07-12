"use client";
import styles from "../styles/Landing.module.css";
import { motion } from "framer-motion";
import { UserPlus, PenTool, Save, Eye, UploadCloud } from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={28} />,
    title: "Create Account",
    description: "Sign up in seconds using your email or Google account.",
  },
  {
    icon: <PenTool size={28} />,
    title: "Start Writing",
    description: "Use our rich Markdown editor to begin your blog journey.",
  },
  {
    icon: <Save size={28} />,
    title: "Save as Draft",
    description: "Save your content safely as a draft. Edit anytime.",
  },
  {
    icon: <Eye size={28} />,
    title: "Preview",
    description: "See a real-time preview of your blog before publishing.",
  },
  {
    icon: <UploadCloud size={28} />,
    title: "Publish",
    description: "One click to publish your blog to the world.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.howItWorks}>
      <h2 className={styles.sectionTitle}>How It Works</h2>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={styles.stepCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className={styles.stepIcon}>{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
