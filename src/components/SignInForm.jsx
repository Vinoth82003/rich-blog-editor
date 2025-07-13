"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/Auth.module.css";
import { LogIn, Mail, Lock } from "lucide-react";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import { set } from "mongoose";

export default function SignInForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isFormValid = form.email.trim() && form.password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success("Signed in successfully!");
      setForm({ email: "", password: "", remember: false });
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>
          <LogIn size={22} /> Sign In
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            <Mail size={16} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <Lock size={16} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            Remember me
          </label>

          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? (
              <>
                <Spinner size={15} /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className={styles.switchAuth}>
            Don’t have an account? <Link href="/signup">Sign Up</Link>
          </p>
          <p className={styles.switchAuth}>
            Go Back to <Link href="/">Home</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
