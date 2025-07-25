"use client";

import styles from "@/styles/DashboardHeader.module.css";
import { CheckCircle2, FileText, FileStack } from "lucide-react";
import { format } from "date-fns";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";

export default function DashboardHeader({ username, stats }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.welcome}>
        <span className={styles.wave}>👋 </span> {username}, welcome back!
      </div>
      <div className={styles.datetime}>
        <p>{format(now, "eeee, MMMM do yyyy - hh:mm:ss a")}</p>
      </div>
      <div className={styles.stats}>
        <div className={styles.card}>
          <CheckCircle2 size={20} />
          <p>Published</p>
          <h2>
            {stats.published || stats.published == 0 ? (
              stats.published
            ) : (
              <Spinner />
            )}
          </h2>
        </div>
        <div className={styles.card}>
          <FileText size={20} />
          <p>Drafts</p>
          <h2>
            {stats.drafts || stats.drafts == 0 ? stats.drafts : <Spinner />}
          </h2>
        </div>
        <div className={styles.card}>
          <FileStack size={20} />
          <p>Total</p>
          <h2>{stats.total || stats.total == 0 ? stats.total : <Spinner />}</h2>
        </div>
      </div>
    </div>
  );
}
