"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductPage() {
  const router = useRouter();
  const [trialLoading, setTrialLoading] = useState(false);

  const handleStartTrial = async () => {
    setTrialLoading(true);
    router.push("/trial-setup");
  };

  const handleSelectPlan = (planId: string) => {
    localStorage.setItem("selected_plan", planId);
    router.push("/checkout");
  };

  return (
    <div className="page">
      {/* HERO - EXCLUSIVE FEEL */}
      <section style={{ marginBottom: 80 }} className="fade-up">
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", margin: 0 }} className="gradient-text">
          Auto Closure
        </h1>
        <div className="hero-tagline" style={{ fontSize: "1.15rem" }}>
          The World's Most Human Sales Agent
        </div>

        <p style={{ maxWidth: 720, marginTop: 20, fontSize: "1.05rem", color: "#d1d1d6" }}>
          Never miss a lead again. Our AI qualifies buyers, answers questions, and closes deals — while you sleep.
        </p>
      </section>

      {/* AUTHORITY & SOCIAL PROOF */}
      <section className="glass fade-up" style={{ padding: 36, marginBottom: 60, textAlign: "center" }}>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#00ffff" }}>$50M+</div>
            <p style={{ marginTop: 4, color: "#a0a0a6", fontSize: "0.95rem" }}>Sales Generated</p>
          </div>
          <div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#7c3aed" }}>12,000+</div>
            <p style={{ marginTop: 4, color: "#a0a0a6", fontSize: "0.95rem" }}>Businesses Trust Us</p>
          </div>
          <div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#00ffff" }}>99.9%</div>
            <p style={{ marginTop: 4, color: "#a0a0a6", fontSize: "0.95rem" }}>Uptime Guaranteed</p>
          </div>
        </div>
      </section>

      <div className="quote fade-up" style={{ marginBottom: 60, textAlign: "center" }}>
        "Auto Closure feels like a real team member. Customers don't know it's AI."
      </div>

      {/* HOW IT WORKS (3 CLEAN STEPS) */}
      <section style={{ marginBottom: 60 }} className="fade-up">
        <h2 style={{ textAlign: "center", marginBottom: 40 }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginTop: 24 }}>
          <div className="glass fade-up" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🎯</div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>Setup In Minutes</h3>
            <p style={{ fontSize: "0.95rem", color: "#a0a0a6" }}>Tell us what you sell and your pricing. We train your AI in seconds.</p>
          </div>

          <div className="glass fade-up" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>💬</div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>AI Replies Instantly</h3>
            <p style={{ fontSize: "0.95rem", color: "#a0a0a6" }}>Your assistant responds like a human, qualifies leads, and answers FAQs automatically.</p>
          </div>

          <div className="glass fade-up" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🚀</div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>Close More Deals</h3>
            <p style={{ fontSize: "0.95rem", color: "#a0a0a6" }}>Hot leads come to you qualified. Your conversion rate increases immediately.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials fade-up" style={{ marginBottom: 60 }}>
        <h2 style={{ textAlign: "center", marginBottom: 40 }}>Trust from Industry Leaders</h2>
        <div className="testimonial-grid" style={{ marginTop: 24 }}>
          <div className="glass testimonial-card fade-up">
            <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
            <strong>Jessica Chen</strong>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>eCommerce Founder</div>
            <p style={{ marginTop: 10, fontSize: "0.95rem", color: "#a0a0a6" }}>
              "Auto Closure closed $45k in deals while I slept. I thought my DMs were a liability until now."
            </p>
          </div>
          <div className="glass testimonial-card fade-up">
            <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
            <strong>Marcus Rodriguez</strong>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Digital Agency Owner</div>
            <p style={{ marginTop: 10, fontSize: "0.95rem", color: "#a0a0a6" }}>
              "Our response time dropped from 8 hours to 8 seconds. Conversion doubled in week one."
            </p>
          </div>
          <div className="glass testimonial-card fade-up">
            <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
            <strong>Priya Kapoor</strong>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>SaaS Founder</div>
            <p style={{ marginTop: 10, fontSize: "0.95rem", color: "#a0a0a6" }}>
              "It sounds like my actual voice. Customers have no idea they're talking to AI. Results speak for themselves."
            </p>
          </div>
        </div>
      </section>

      {/* TRIAL CTA - CENTERED & PROMINENT */}
      <section 
        className="glass fade-up" 
        style={{ 
          padding: 48, 
          marginBottom: 60, 
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(0, 255, 255, 0.08))",
          border: "1px solid rgba(124, 58, 237, 0.2)",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: 12 }}>Try It Free — 15 Messages</h2>
        <p style={{ color: "#a0a0a6", marginBottom: 28, fontSize: "1rem" }}>
          No credit card. No commitment. See how Auto Closure works with your business.
        </p>
        <button
          onClick={handleStartTrial}
          disabled={trialLoading}
          style={{
            padding: "16px 40px",
            fontSize: "1.05rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #7c3aed, #00ffff)",
            color: "#000",
            border: "none",
            borderRadius: 999,
            cursor: trialLoading ? "not-allowed" : "pointer",
            boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            opacity: trialLoading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!trialLoading) {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 14px 40px rgba(124, 58, 237, 0.6)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(124, 58, 237, 0.35)";
          }}
        >
          {trialLoading ? "Loading..." : "Start Free Trial"}
        </button>
      </section>

      {/* PRICING SECTION */}
      <section style={{ marginBottom: 40 }} className="fade-up">
        <h2 style={{ textAlign: "center", marginBottom: 40 }}>Choose Your Plan</h2>
        <div className="pricing-grid" style={{ marginTop: 24 }}>
          {/* STARTER - DIMMED */}
          <div className="glass price-card fade-up" style={{ opacity: 0.75 }}>
            <div className="price-badge">Limited</div>
            <h3 style={{ fontSize: "2rem", fontWeight: 800 }}>$19</h3>
            <p style={{ fontSize: "0.95rem", color: "#a0a0a6", marginBottom: 8 }}>Starter</p>
            <p style={{ fontSize: "0.85rem", color: "#808086", marginBottom: 20 }}>Perfect for testing</p>
            <ul style={{ textAlign: "left", fontSize: "0.9rem", color: "#a0a0a6", marginBottom: 20 }}>
              <li>✓ Up to 1,000 messages/month</li>
              <li>✓ Basic AI customization</li>
              <li>✓ Email support</li>
              <li>✗ No integrations</li>
            </ul>
            <button
              onClick={() => handleSelectPlan("starter")}
              style={{
                width: "100%",
                padding: "12px 20px",
                fontSize: "0.95rem",
                fontWeight: 700,
                background: "rgba(255, 255, 255, 0.08)",
                color: "#d1d1d6",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              Choose Plan
            </button>
          </div>

          {/* PRO - HIGHLIGHTED */}
          <div className="glass price-card most-popular fade-up">
            <div className="price-badge" style={{ background: "rgba(124, 58, 237, 0.2)" }}>Best Value</div>
            <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#00ffff" }}>$29</h3>
            <p style={{ fontSize: "0.95rem", color: "#d1d1d6", marginBottom: 8 }}>Pro</p>
            <p style={{ fontSize: "0.85rem", color: "#7c3aed", marginBottom: 20, fontWeight: 600 }}>Most popular choice</p>
            <ul style={{ textAlign: "left", fontSize: "0.9rem", color: "#d1d1d6", marginBottom: 20 }}>
              <li>✓ Up to 10,000 messages/month</li>
              <li>✓ Advanced AI customization</li>
              <li>✓ Priority support</li>
              <li>✓ Basic integrations</li>
            </ul>
            <button
              onClick={() => handleSelectPlan("pro")}
              style={{
                width: "100%",
                padding: "12px 20px",
                fontSize: "0.95rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #7c3aed, #00ffff)",
                color: "#000",
                border: "none",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              Choose Pro
            </button>
          </div>

          {/* BUSINESS - ENTERPRISE */}
          <div className="glass price-card fade-up">
            <div className="price-badge">Enterprise</div>
            <h3 style={{ fontSize: "2rem", fontWeight: 800 }}>$49</h3>
            <p style={{ fontSize: "0.95rem", color: "#a0a0a6", marginBottom: 8 }}>Business</p>
            <p style={{ fontSize: "0.85rem", color: "#808086", marginBottom: 20 }}>For serious operators</p>
            <ul style={{ textAlign: "left", fontSize: "0.9rem", color: "#a0a0a6", marginBottom: 20 }}>
              <li>✓ Unlimited messages</li>
              <li>✓ Custom AI training</li>
              <li>✓ 1-hour support response</li>
              <li>✓ Advanced integrations</li>
            </ul>
            <button
              onClick={() => handleSelectPlan("business")}
              style={{
                width: "100%",
                padding: "12px 20px",
                fontSize: "0.95rem",
                fontWeight: 700,
                background: "rgba(255, 255, 255, 0.08)",
                color: "#d1d1d6",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              Choose Plan
            </button>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="fade-up" style={{ textAlign: "center", marginBottom: 40 }}>
        <p style={{ color: "#a0a0a6", marginBottom: 20, fontSize: "0.95rem" }}>
          Still not sure? Start with 15 free messages.
        </p>
        <button
          onClick={handleStartTrial}
          disabled={trialLoading}
          style={{
            padding: "14px 36px",
            fontSize: "1rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #7c3aed, #00ffff)",
            color: "#000",
            border: "none",
            borderRadius: 999,
            cursor: trialLoading ? "not-allowed" : "pointer",
            boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
            opacity: trialLoading ? 0.6 : 1,
          }}
        >
          {trialLoading ? "Loading..." : "Try Free First"}
        </button>
      </section>
    </div>
  );
}
