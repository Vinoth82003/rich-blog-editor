"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import styles from "../../../styles/Dashboard.module.css";
import {
  LockKeyhole,
  SaveAll,
  Eye,
  EyeOff,
  ClipboardCopy,
  CheckCircle2,
  Trash2Icon,
} from "lucide-react";
import Swal from "sweetalert2";
import { fetchWithAuth } from "@/lib/auth/client";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchWithAuth("/api/auth/me")
      .then((r) => r.json())
      .then(setUser);
  }, []);

  const save = async () => {
    const res = await fetchWithAuth("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (res.ok) toast.success("Updated");
  };

  const generateApiKey = async () => {
    setLoading(true);
    const toastId = toast.loading("Generating API Key...");
    try {
      const res = await fetchWithAuth("/api/auth/apikey", { method: "POST" });
      const data = await res.json();
      if (data.apiKey) {
        toast.success("API Key generated! Copy and store it securely.");
        setUser((prev) => ({ ...prev, apiKey: data.apiKey }));
      }
    } catch (error) {
      toast.error("Failed to generate API Key");
    }
    setLoading(false);
    toast.dismiss(toastId);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(user.apiKey);
      setCopied(true);
      toast.success("API Key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy API Key");
    }
  };

  const deleteApiKey = async () => {
    if (!user.apiKey) return;

    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete your current API key. You can't undo this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmed.isConfirmed) return;

    setLoading(true);
    const toastId = toast.loading("Deleting API Key...");
    try {
      const res = await fetchWithAuth("/api/auth/apikey", { method: "DELETE" });
      if (res.ok) {
        toast.success("API Key deleted");
        setUser((prev) => ({ ...prev, apiKey: "" }));

        await Swal.fire({
          title: "Deleted!",
          text: "Your API key has been removed.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } else {
        toast.error("Failed to delete API Key");
      }
    } catch (err) {
      toast.error("Error deleting API Key");
    }
    setLoading(false);
    toast.dismiss(toastId);
  };


  return (
    <DashboardLayout>
      {user ? (
        <div className={styles.settingsContainer}>
          <h2 className={styles.settingsHeading}>Settings</h2>

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

          {user.apiKey && (
            <label>
              API Key
              <span className={styles.apiKeyInfo}>
                Generate and use this key for accessing your blogs via API.
              </span>
              <div className={styles.apiKeyField}>
                <input
                  value={user.apiKey || ""}
                  type={showApiKey ? "text" : "password"}
                  readOnly
                />
                <button
                  className={styles.iconBtn}
                  onClick={() => setShowApiKey(!showApiKey)}
                  title={showApiKey ? "Hide" : "Show"}
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  className={styles.iconBtn}
                  onClick={copyToClipboard}
                  title="Copy API Key"
                >
                  {copied ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <ClipboardCopy size={18} />
                  )}
                </button>
                <button
                  className={styles.iconBtn}
                  onClick={deleteApiKey}
                  title="Delete API Key"
                >
                  <Trash2Icon size={18} />
                </button>
              </div>
              <span className={styles.apiKeyWarning}>
                ⚠️ Keep your API key secure and never share it publicly.
              </span>
            </label>
          )}

          <div className={styles.buttonGroup}>
            {!user.apiKey && (
              <button onClick={generateApiKey} disabled={loading}>
                <LockKeyhole size={16} /> Generate API Key
              </button>
            )}
            <button onClick={save} disabled={loading}>
              <SaveAll size={16} /> Save
            </button>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </DashboardLayout>
  );
}
