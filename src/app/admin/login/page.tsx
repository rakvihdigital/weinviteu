"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

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
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#050505",
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "rgba(20, 20, 20, 0.8)",
        borderRadius: "20px",
        padding: "50px 40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        border: "1px solid var(--line)",
        textAlign: "center",
      }}>
        <div style={{
          width: "60px", height: "60px",
          background: "var(--gold)", borderRadius: "50%",
          display: "grid", placeItems: "center",
          margin: "0 auto 25px",
        }}>
          <Lock size={24} color="#000" />
        </div>

        <h1 style={{
          fontFamily: "var(--serif)",
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "var(--ink)",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}>
          <img src="/images/logo.png" alt="WeInviteU" style={{ width: "24px", height: "auto" }} />
          Admin Login
        </h1>
        <p style={{
          color: "var(--muted)",
          fontSize: "13px",
          marginBottom: "30px",
        }}>
          Enter your admin credentials to continue
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Admin Email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "var(--sans)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--ink)",
                transition: "all 0.2s",
                outline: "none",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
              onBlur={(e) => e.target.style.borderColor = "var(--line)"}
            />
          </div>
          
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 44px 14px 16px",
                border: error ? "1px solid #e53e3e" : "1px solid var(--line)",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "var(--sans)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--ink)",
                transition: "all 0.2s",
                outline: "none",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
              onBlur={(e) => e.target.style.borderColor = error ? "#e53e3e" : "var(--line)"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "var(--muted)",
                padding: "4px",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p style={{
              color: "#e53e3e",
              fontSize: "13px",
              marginBottom: "15px",
              textAlign: "left",
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: "var(--gold)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "var(--sans)",
              fontWeight: 600,
              letterSpacing: "0.5px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ color: "var(--muted)", fontSize: "11px", marginTop: "25px" }}>
          Protected admin area · WeInviteU © 2025
        </p>
      </div>
    </div>
  );
}
