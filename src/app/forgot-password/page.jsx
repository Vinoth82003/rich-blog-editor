"use client";

import { useState } from "react";
import styles from "./page.module.css";
import toast, { Toaster } from "react-hot-toast";
import { MailCheck, ShieldCheck, KeyRound } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const notify = (msg, type = "success") => toast[type](msg);

  const handleSendOTP = async () => {
    if (!email.includes("@")) return notify("Invalid email", "error");

    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setLoading(false);

    const data = await res.json();
    res.ok ? (notify("OTP sent"), setStep(2)) : notify(data.error, "error");
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
    setLoading(false);

    const data = await res.json();
    res.ok ? (notify("OTP verified"), setStep(3)) : notify(data.error, "error");
  };

  const handleResetPassword = async () => {
    if (password.length < 6) return notify("Password too short", "error");
    if (password !== confirmPassword)
      return notify("Passwords don't match", "error");

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    const data = await res.json();
    if (res.ok) {
      notify("Password reset!");
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
    } else notify(data.error, "error");
  };

  return (
    <div className={styles.page}>
      <Toaster position="top-center" />
      <h1>Forgot Password</h1>

      {step === 1 && (
        <div className={styles.step}>
          <label>
            <MailCheck /> Email:
          </label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.step}>
          <label>
            <ShieldCheck /> OTP:
          </label>
          <input
            type="text"
            value={otp}
            placeholder="123456"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
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
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="********"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
}
