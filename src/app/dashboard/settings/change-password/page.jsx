"use client";
// Optional if needed: disable prerendering entirely
// export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import toast from "react-hot-toast";
import { ShieldCheck, KeyRound } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function ChangePasswordPage() {
  const [step, setStep] = useState(2); // Assume OTP is sent from previous step
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const emailFromParams = new URLSearchParams(window.location.search).get(
      "email"
    );
    if (emailFromParams) setEmail(emailFromParams);
  }, []);

  const notify = (msg, type = "success") => toast[type](msg);

  const handleVerifyOTP = async () => {
    if (!otp) return notify("Enter OTP", "error");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      notify("OTP verified");
      setStep(3);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 6)
      return notify("Password must be at least 6 characters", "error");
    if (password !== confirmPassword)
      return notify("Passwords do not match", "error");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      notify("Password reset successfully!");
      setStep(2);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");

      router.push("/dashboard/settings");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <h1>Change Password</h1>

        {step === 2 && (
          <div className={styles.step}>
            <p>
              Email Sent to <strong>{email}</strong>
            </p>

            <label>
              <ShieldCheck /> OTP:
            </label>
            <input
              type="text"
              value={otp}
              placeholder="Enter 6-digit OTP"
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
            />
            <button onClick={handleVerifyOTP} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size={16} /> Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className={styles.step}>
            <label>
              <KeyRound /> New Password:
            </label>
            <input
              type="password"
              value={password}
              placeholder="New password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Re-enter password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={handleResetPassword} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size={16} /> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
