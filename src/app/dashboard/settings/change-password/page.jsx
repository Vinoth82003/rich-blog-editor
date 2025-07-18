"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import toast from "react-hot-toast";
import { ShieldCheck, KeyRound } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function ForgotPassword() {
  const [step, setStep] = useState(2);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const presetEmail = searchParams.get("email");

  const notify = (msg, type = "success") => toast[type](msg);
  const router = useRouter();

  useEffect(() => {
    if (presetEmail) {
      setEmail(presetEmail);
    }
  }, [presetEmail]);

  const handleVerifyOTP = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    const data = await res.json();
    if (res.ok) {
      notify("Password reset!");
      setStep(2);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");

      router.push("/dashboard/settings");
    } else notify(data.error, "error");
  };

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <h1>Change Password</h1>

        {step === 1 && (
          <div className={styles.step}>
            <label>
              {loading ? (
                <>
                  <Spinner /> Sending OTP ...
                </>
              ) : (
                "Send OTP"
              )}
            </label>
          </div>
        )}

        {step === 2 && (
          <div className={styles.step}>
            <p>Email Sent to {email}</p>
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
              {loading ? (
                <>
                  <Spinner /> Verifying...
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
              {loading ? (
                <>
                  <Spinner /> Resetting...
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
