"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const businessTypes = [
  "Ecommerce",
  "SaaS",
  "Services",
  "Agency",
  "Course Creator",
  "Consulting",
  "Coaching",
  "Other",
];

const tones = [
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Luxury", value: "luxury" },
  { label: "Aggressive", value: "aggressive" },
];

export default function TrialSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_type: businessTypes[0],
    what_you_sell: "",
    pricing_range: "$10-50",
    tone: tones[0].value,
    special_instructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call backend to create preview business
      const { apiRequest } = await import("@/lib/api");
      const resp = await apiRequest("/start_preview", "POST", { ...form, preview_mode: true });
      console.log("start_preview response:", resp);
      if (!resp.ok) throw new Error(resp.data?.message || "Failed to create preview");
      const data = resp.data || {};
      const slug = data.slug || data.business_slug || "preview";
      // Redirect to chat with preview slug
      router.push(`/chat/${slug}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Error starting trial");
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section style={{ maxWidth: 600, margin: "0 auto", marginBottom: 60 }} className="fade-up">
        <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 2.8rem)", marginBottom: 16 }}>
          Start Your Free Trial
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#a0a0a6", marginBottom: 12 }}>
          Tell us about your business. We'll set up Auto Closure in seconds.
        </p>
        <p style={{ fontSize: "0.9rem", color: "#808086" }}>
          15 free messages. No credit card required.
        </p>
      </section>

      <section style={{ maxWidth: 600, margin: "0 auto" }} className="fade-up">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
              What does your business do?
            </label>
            <select
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
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
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* What You Sell */}
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
              What do you sell / offer?
            </label>
            <textarea
              name="what_you_sell"
              value={form.what_you_sell}
              onChange={handleChange}
              placeholder="e.g., Custom web design, $5-10k per project"
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

          {/* Pricing Range */}
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
              What's your pricing range?
            </label>
            <select
              name="pricing_range"
              value={form.pricing_range}
              onChange={handleChange}
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
              <option value="$10-50">$10-50</option>
              <option value="$50-200">$50-200</option>
              <option value="$200-1000">$200-1,000</option>
              <option value="$1000+">$1,000+</option>
            </select>
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
              How should Auto Closure sound?
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {tones.map((tone) => (
                <label
                  key={tone.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px",
                    borderRadius: 8,
                    border: form.tone === tone.value ? "1px solid #7c3aed" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: form.tone === tone.value ? "rgba(124, 58, 237, 0.1)" : "rgba(255, 255, 255, 0.02)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={tone.value}
                    checked={form.tone === tone.value}
                    onChange={handleChange}
                    style={{ cursor: "pointer" }}
                  />
                  <span style={{ color: "#d1d1d6", fontSize: "0.95rem" }}>{tone.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
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
              Any special instructions? (Optional)
            </label>
            <textarea
              name="special_instructions"
              value={form.special_instructions}
              onChange={handleChange}
              placeholder="e.g., Always mention our 30-day guarantee, avoid discussing competitors..."
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
                e.currentTarget.style.boxShadow = "0 14px 40px rgba(124, 58, 237, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(124, 58, 237, 0.35)";
            }}
          >
            {loading ? "Setting up..." : "Start Free Trial"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#808086" }}>
            By starting your trial, you agree to our terms of service.
          </p>
        </form>
      </section>
    </div>
  );
}
