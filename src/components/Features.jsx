import styles from "../styles/Landing.module.css";
import { motion } from "framer-motion";
import { PenTool, Eye, BarChart4 } from "lucide-react";

export default function Features() {
  return (
    <motion.section
      className={styles.features}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
    >
      {[
        {
          icon: <PenTool size={28} />,
          title: "Draft & Write",
          text: "Use rich markdown and editor tools to shape your ideas.",
        },
        {
          icon: <Eye size={28} />,
          title: "Preview Before Publish",
          text: "Visualize your blog before making it public.",
        },
        {
          icon: <BarChart4 size={28} />,
          title: "Analytics Dashboard",
          text: "Track status, read time, publish date, and banners.",
        },
      ].map((feat, idx) => (
        <motion.div
          className={styles.card}
          key={idx}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.icon}>{feat.icon}</div>
          <h3>{feat.title}</h3>
          <p>{feat.text}</p>
        </motion.div>
      ))}
    </motion.section>
  );
}
