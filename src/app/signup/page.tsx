"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check URL first, then localStorage
    const planFromUrl = searchParams.get("plan");
    const planFromStorage = localStorage.getItem("selected_plan");
    const plan = planFromUrl || planFromStorage;

    setSelectedPlan(plan || null);
    setIsLoading(false);
  }, [searchParams]);

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#d1d1d6" }}>
        <div style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Loading...</div>
      </div>
    );
  }

  // If no plan selected, show plan selector
  if (!selectedPlan) {
    return (
      <section
        style={{
          padding: "40px 20px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", marginBottom: "16px", color: "#d1d1d6" }}>
          Please choose a plan to continue
        </h2>
        <p style={{ fontSize: "1rem", color: "#a0a0a6", marginBottom: "32px" }}>
          Select a plan that matches your needs:
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={() => {
              localStorage.setItem("selected_plan", "basic");
              setSelectedPlan("basic");
            }}
            style={{
              padding: "12px 20px",
              fontSize: "1rem",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Basic Plan ($9/mo)
          </button>
          <button
            onClick={() => {
              localStorage.setItem("selected_plan", "pro");
              setSelectedPlan("pro");
            }}
            style={{
              padding: "12px 20px",
              fontSize: "1rem",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Pro Plan ($29/mo)
          </button>
          <button
            onClick={() => {
              localStorage.setItem("selected_plan", "business");
              setSelectedPlan("business");
            }}
            style={{
              padding: "12px 20px",
              fontSize: "1rem",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Business Plan ($49/mo)
          </button>
        </div>
        <a
          href="/pricing"
          style={{
            color: "#8b5cf6",
            textDecoration: "underline",
            fontSize: "1rem",
          }}
        >
          ← Back to pricing
        </a>
      </section>
    );
  }

  // Plan is selected - show signup form
  return (
    <section
      style={{
        padding: "40px 20px",
        textAlign: "center",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", marginBottom: "8px", color: "#d1d1d6" }}>
        Create Your Auto Closure Account
      </h1>
      <p style={{ fontSize: "0.95rem", color: "#a0a0a6", marginBottom: "32px" }}>
        Selected plan:{" "}
        <strong style={{ color: "#8b5cf6", textTransform: "capitalize" }}>
          {selectedPlan}
        </strong>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/onboarding");
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#d1d1d6",
              fontSize: "0.95rem",
              textAlign: "left",
            }}
          >
            Business Name
          </label>
          <input
            type="text"
            placeholder="Your business name"
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#d1d1d6",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#d1d1d6",
              fontSize: "0.95rem",
              textAlign: "left",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#d1d1d6",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            fontSize: "1rem",
            fontWeight: "bold",
            background: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "12px",
          }}
        >
          Continue
        </button>
      </form>

      <div style={{ marginTop: "24px" }}>
        <button
          onClick={() => {
            localStorage.removeItem("selected_plan");
            setSelectedPlan(null);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#8b5cf6",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Choose a different plan
        </button>
      </div>
    </section>
  );
}
