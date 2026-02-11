"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { apiRequest } = await import("@/lib/api");
      const resp = await apiRequest("/signup_custom", "POST", {
        email: form.email,
        password: form.password,
        business_name: form.business_name,
      });

      console.log("signup response:", resp);

      if (!resp.ok) {
        const errMsg = resp.data?.message || `Signup failed: ${resp.status}`;
        throw new Error(errMsg);
      }

      // If token present, store it
      const token = resp.data?.token || resp.data?.access_token;
      if (token) localStorage.setItem("token", token);

      // Redirect to onboarding
      router.push("/onboarding");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Error creating account");
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section style={{ maxWidth: 450, margin: "0 auto", marginBottom: 60 }} className="fade-up">
        <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 2.8rem)", marginBottom: 8 }}>
          Create Your Account
        </h1>
        <p style={{ fontSize: "1rem", color: "#a0a0a6", marginBottom: 32 }}>
          Join 12,000+ businesses using Auto Closure to close deals faster.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Business Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#d1d1d6",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              placeholder="Your business name"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                color: "#d1d1d6",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#d1d1d6",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                color: "#d1d1d6",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#d1d1d6",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                required
                minLength={8}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 8,
                  color: "#d1d1d6",
                  boxSizing: "border-box",
                  paddingRight: "40px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#a0a0a6",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ color: "#ff6b6b", fontSize: "0.9rem", padding: "12px", background: "rgba(255, 107, 107, 0.1)", borderRadius: 8 }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              fontSize: "1rem",
              fontWeight: 700,
              background: loading ? "rgba(124, 58, 237, 0.5)" : "linear-gradient(135deg, #7c3aed, #00ffff)",
              color: "#000",
              border: "none",
              borderRadius: 999,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: loading ? 0.6 : 1,
              marginTop: 8,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(124, 58, 237, 0.35)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#808086", marginTop: 12 }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
              Sign in
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}
