"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    business_type: "",
    description: "",
    services: "",
    price_range: "",
    tone: "",
    extra_instructions: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await apiRequest(
        "/update_profile",
        "POST",
        form,
        true
      );

      console.log("Update profile response:", res);

      if (res && !res.error) {
        router.push("/product");
      } else {
        alert("Server error. Check console.");
      }
    } catch (err) {
      console.error("Update profile crash:", err);
      alert("Unexpected error occurred");
    }
  };

  return (
    <div className="page">
      <section style={{ maxWidth: 600, margin: "0 auto", marginBottom: 60 }} className="fade-up">
        <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 2.8rem)", marginBottom: 16 }}>
          Configure Your AI Sales Agent
        </h1>
        <p style={{ fontSize: "1rem", color: "#a0a0a6", marginBottom: 32 }}>
          Tell us about your business so your AI can sound like you.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Business Type */}
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
              What type of business are you?
            </label>
            <input
              type="text"
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
              placeholder="e.g., Digital Agency, SaaS, E-commerce"
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

          {/* Description */}
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
              Describe your business in detail
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What makes your business unique? What problems do you solve?"
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
                fontFamily: "inherit",
                minHeight: "100px",
                resize: "vertical",
              }}
            />
          </div>

          {/* Services */}
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
              What products or services do you sell?
            </label>
            <textarea
              name="services"
              value={form.services}
              onChange={handleChange}
              placeholder="List your main offerings"
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
                fontFamily: "inherit",
                minHeight: "80px",
                resize: "vertical",
              }}
            />
          </div>

          {/* Price Range */}
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
              Typical pricing range
            </label>
            <input
              type="text"
              name="price_range"
              value={form.price_range}
              onChange={handleChange}
              placeholder="e.g., $50-$200 per project"
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

          {/* Tone */}
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
              What tone should your assistant use?
            </label>
            <select
              name="tone"
              className="input"
              value={form.tone}
              onChange={handleChange}
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
            >
              <option value="">Select tone</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="confident">Confident</option>
            </select>
          </div>

          {/* Extra Instructions */}
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
              Any additional instructions? (Optional)
            </label>
            <textarea
              name="extra_instructions"
              value={form.extra_instructions}
              onChange={handleChange}
              placeholder="e.g., Always mention our 30-day guarantee, promote our premium plan..."
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                color: "#d1d1d6",
                boxSizing: "border-box",
                fontFamily: "inherit",
                minHeight: "80px",
                resize: "vertical",
              }}
            />
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
              padding: "14px 20px",
              fontSize: "1rem",
              fontWeight: 700,
              background: loading ? "rgba(124, 58, 237, 0.5)" : "linear-gradient(135deg, #7c3aed, #00ffff)",
              color: "#000",
              border: "none",
              borderRadius: 999,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: loading ? 0.6 : 1,
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
            {loading ? "Configuring..." : "Launch My AI Agent"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#808086", marginTop: 12 }}>
            This usually takes 30-60 seconds.
          </p>
        </form>
      </section>
    </div>
  );
}
