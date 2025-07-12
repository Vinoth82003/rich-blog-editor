"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import styles from "../../../styles/Dashboard.module.css";

export default function Settings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setUser);
  }, []);

  const save = async () => {
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (res.ok) toast.success("Updated");
  };

  //   if (!user) return <Spinner />;
  return (
    <DashboardLayout>
      {user ? (
        <div className={styles.settingsContainer}>
          <h2>Settings</h2>
          <label>
            Name
            <input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </label>
          <label>
            Email
            <input value={user.email} disabled />
          </label>
          <label>
            Profile URL
            <input
              value={user.profileImage}
              onChange={(e) =>
                setUser({ ...user, profileImage: e.target.value })
              }
            />
          </label>
          <button onClick={save}>Save</button>
        </div>
      ) : (
        <Spinner />
      )}
    </DashboardLayout>
  );
}
