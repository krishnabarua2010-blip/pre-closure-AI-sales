"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleTryPreview = () => {
    router.push("/trial-setup");
  };

  const handleSelectPlan = (planId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      // Not logged in — store choice and redirect to signup
      localStorage.setItem("selected_plan", planId);
      router.push("/signup");
      return;
    }

    // Logged in — activate plan via API
    (async () => {
      const { apiRequest } = await import("@/lib/api");
      const resp = await apiRequest("/activate_plan", "POST", { plan: planId }, true);
      console.log("activate_plan response:", resp);
      if (resp.ok) {
        router.push("/dashboard");
      } else {
        alert(resp.data?.message || "Failed to activate plan");
      }
    })();
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set expiration to 7 days from now (arbitrary founders deal duration)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const now = new Date();
      const difference = expirationDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page">
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>
        Simple Pricing. Real Results.
      </h1>

      <p style={{ textAlign: "center", opacity: 0.7, marginBottom: 20 }}>
        Start now. Upgrade only when Auto Closure makes you money.
      </p>

      {/* FOMO TIMER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
          padding: "16px 24px",
          background: "rgba(139, 92, 246, 0.1)",
          borderRadius: "8px",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          maxWidth: "400px",
          margin: "0 auto 40px",
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", opacity: 0.8 }}>
          🔥 Early access pricing expires in
        </p>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#8b5cf6",
            letterSpacing: "3px",
            fontFamily: "monospace",
          }}
        >
          {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
        </div>
      </div>

      {/* TRY PREVIEW BUTTON */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <button
          onClick={handleTryPreview}
          style={{
            background: "rgba(139, 92, 246, 0.2)",
            border: "1px solid rgba(139, 92, 246, 0.5)",
            color: "#8b5cf6",
            padding: "12px 32px",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = "rgba(139, 92, 246, 0.3)";
            (e.target as HTMLButtonElement).style.borderColor = "#8b5cf6";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = "rgba(139, 92, 246, 0.2)";
            (e.target as HTMLButtonElement).style.borderColor = "rgba(139, 92, 246, 0.5)";
          }}
        >
          ← Try Preview (15 messages)
        </button>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: 12 }}>
          See how Auto Closure works. No credit card required.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 32,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* STARTER - UNATTRACTIVE BUT VALID */}
        <div className="glass" style={{ padding: 32, opacity: 0.8 }}>
          <h2 style={{ color: "#9ca3af" }}>$19</h2>
          <p style={{ color: "#6b7280", marginBottom: 16 }}>Starter</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: 16 }}>
            For testing only
          </p>
          <ul style={{ marginBottom: 24 }}>
            <li>✔ 200 chats / month</li>
            <li>✔ Basic AI replies</li>
            <li>✔ Lead classification</li>
            <li style={{ opacity: 0.5 }}>✗ No advanced lead handling</li>
          </ul>
          <a
            className="cta"
            onClick={() => handleSelectPlan("starter")}
            style={{
              display: "block",
              textAlign: "center",
              opacity: 0.7,
              transition: "opacity 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            Choose Starter
          </a>
        </div>

        {/* PRO - BEST DEAL, VISUALLY DOMINANT */}
        <div
          className="glass"
          style={{
            padding: 36,
            transform: "scale(1.08)",
            border: "2px solid #8b5cf6",
            background: "rgba(139, 92, 246, 0.05)",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.2)",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#8b5cf6",
              color: "white",
              padding: "4px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            ⭐ MOST POPULAR
          </div>

          <h2 style={{ color: "#8b5cf6", marginTop: 16 }}>$29</h2>
          <p style={{ marginBottom: 8 }}>Pro</p>
          <p style={{ fontSize: "14px", color: "#10b981", marginBottom: 16 }}>
            Best for growing businesses
          </p>
          <ul style={{ marginBottom: 24 }}>
            <li>✔ 1,500 chats / month</li>
            <li>✔ Human-like AI replies</li>
            <li>✔ Hot lead detection</li>
            <li>✔ Daily performance summary</li>
            <li>✔ Smart automations</li>
          </ul>
          <a
            className="cta"
            onClick={() => handleSelectPlan("pro")}
            style={{
              display: "block",
              textAlign: "center",
              background: "#8b5cf6",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Start Pro Plan
          </a>
        </div>

        {/* BUSINESS - PREMIUM POSITIONING */}
        <div className="glass" style={{ padding: 32 }}>
          <h2>$49</h2>
          <p style={{ marginBottom: 8 }}>Business</p>
          <p style={{ fontSize: "14px", color: "#f59e0b", marginBottom: 16 }}>
            For high-volume businesses
          </p>
          <ul style={{ marginBottom: 24 }}>
            <li>✔ Unlimited chats</li>
            <li>✔ Priority AI handling</li>
            <li>✔ Full automation suite</li>
            <li>✔ Advanced analytics</li>
            <li>✔ Dedicated support</li>
          </ul>
          <a
            className="cta"
            onClick={() => handleSelectPlan("business")}
            style={{
              display: "block",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Upgrade to Business
          </a>
        </div>
      </div>

      {/* MOBILE OPTIMIZATION STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .glass {
            padding: 24px !important;
          }

          div[style*="scale(1.08)"] {
            transform: scale(1.04) !important;
          }

          button, a[class*="cta"] {
            padding: 12px 20px !important;
            font-size: 16px !important;
          }

          h2 {
            font-size: 28px !important;
          }

          div[style*="1200px"] {
            gap: 16px !important;
          }

          div[style*="400px"] {
            margin: 0 16px 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
