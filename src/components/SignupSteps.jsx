"use client";
import { useState } from "react";
import styles from "../styles/Auth.module.css";
import { UserPlus, Mail, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import Spinner from "./Spinner";

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getStrength = () => {
    const { password } = form;
    if (password.length === 0) return null;
    if (password.length < 6) return "Weak";
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return "Moderate";
    if (password.length >= 8 && /[!@#$%^&*]/.test(password)) return "Strong";
    return "Good";
  };

  const passwordStrength = getStrength();

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.confirmPassword.trim() &&
    form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 1500));
    // TODO: call API here

    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>
          <UserPlus size={22} /> Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            <UserPlus size={16} />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </label>
          <label>
            <Mail size={16} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </label>
          <label>
            <Lock size={16} />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </label>
          {passwordStrength && (
            <div className={styles.strength}>
              Strength: <strong>{passwordStrength}</strong>
            </div>
          )}
          <label>
            <CheckCircle size={16} />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </label>

          <button type="submit" disabled={!isFormValid || loading}>
            {loading ? (
              <>
                <Spinner size={15} />{" "}
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className={styles.switchAuth}>
            Already have an account? <Link href="/signin">Sign In</Link>
          </p>
          <p className={styles.switchAuth}>
            Go back to <Link href="/">Home</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
