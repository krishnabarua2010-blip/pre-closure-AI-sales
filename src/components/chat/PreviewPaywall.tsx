"use client";

export function PreviewPaywall() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        textAlign: "center",
        background: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        className="glass"
        style={{
          maxWidth: "500px",
          padding: "40px",
          borderRadius: "16px",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "16px" }}>
          Preview Limit Reached
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#a0a0a6", marginBottom: "24px" }}>
          You've seen how Auto Closure works with 15 sample messages.
        </p>

        <div
          style={{
            background: "rgba(139, 92, 246, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "32px",
            borderLeft: "4px solid #8b5cf6",
          }}
        >
          <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: "#d1d1d6" }}>
            Ready to automate your leads?
          </p>
          <ul
            style={{
              margin: "0",
              paddingLeft: "20px",
              textAlign: "left",
              color: "#a0a0a6",
              fontSize: "0.95rem",
            }}
          >
            <li style={{ marginBottom: "8px" }}>Unlimited conversations</li>
            <li style={{ marginBottom: "8px" }}>Advanced lead classification</li>
            <li style={{ marginBottom: "8px" }}>Daily performance summaries</li>
            <li>24/7 automated support</li>
          </ul>
        </div>

        <a
          href="/pricing"
          style={{
            display: "inline-block",
            background: "#8b5cf6",
            color: "white",
            padding: "14px 40px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            marginBottom: "16px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#a78bfa")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#8b5cf6")
          }
        >
          Upgrade Now
        </a>

        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Choose a plan that fits your business. Start at just $19/month.
        </p>
      </div>
    </div>
  );
}
