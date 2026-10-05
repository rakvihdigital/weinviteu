"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  AlertCircle
} from "lucide-react";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid administrator credentials. Please check and retry.");
      }
    } catch {
      setError("Unable to authenticate with the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBackdropOrbs} aria-hidden="true">
        <div className={styles.orbTop} />
        <div className={styles.orbCenter} />
      </div>

      <div className={styles.loginCard}>
        {/* Atelier Badge */}
        <div className={styles.atelierBadge}>
          <Sparkles size={11} /> Atelier Portal · Restricted Access
        </div>

        {/* Brand Emblem */}
        <div className={styles.emblemWrapper}>
          <div className={styles.emblemRing} />
          <div className={styles.emblemInner}>
            <img
              src="/images/logo.png"
              alt="WeInviteU Logo"
              className={styles.emblemLogo}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.loginTitle}>
          WeInviteU <em>Atelier</em>
        </h1>
        <p className={styles.loginSubtitle}>
          Sign in with executive credentials to manage templates, inquiries & bespoke invitations.
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="admin-email" className={styles.inputLabel}>
              Administrator Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="director@weinviteu.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="admin-password" className={styles.inputLabel}>
              Security Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className={styles.errorMessage}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                <span>Authenticating Atelier Session…</span>
              </>
            ) : (
              <span>Sign In to Studio Portal</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <footer className={styles.loginFooter}>
          <Link href="/" className={styles.returnLink}>
            <ArrowLeft size={13} /> Return to Guest Showcase
          </Link>
          <div className={styles.securityNote}>
            <ShieldCheck size={13} /> 256-bit Encrypted Session · WeInviteU Studio
          </div>
        </footer>
      </div>
    </div>
  );
}
