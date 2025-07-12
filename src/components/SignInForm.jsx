"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Auth.module.css";
import { LogIn, Mail, Lock } from "lucide-react";
import Spinner from "./Spinner";

export default function SignInForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = form.email.trim() && form.password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);

    // TODO: call login API here
    await new Promise((res) => setTimeout(res, 1200));

    setLoading(false);
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
