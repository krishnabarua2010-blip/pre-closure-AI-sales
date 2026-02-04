"use client";

export default function PricingPage() {
  return (
    <div className="page">
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>
        Simple Pricing. Real Results.
      </h1>

      <p style={{ textAlign: "center", opacity: 0.7, marginBottom: 60 }}>
        Start now. Upgrade only when Auto Closure makes you money.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 32,
        }}
      >
        {/* STARTER */}
        <div className="glass" style={{ padding: 32 }}>
          <h2>$19</h2>
          <p>Starter</p>
          <ul>
            <li>✔ 200 chats / month</li>
            <li>✔ AI replies</li>
            <li>✔ Lead classification</li>
          </ul>
          <button className="cta" disabled>
            Coming Soon
          </button>
        </div>

        {/* PRO */}
        <div
          className="glass"
          style={{
            padding: 36,
            transform: "scale(1.05)",
            border: "2px solid #7c3aed",
          }}
        >
          <p style={{ color: "#7c3aed" }}>MOST POPULAR</p>
          <h2>$29</h2>
          <p>Pro</p>
          <ul>
            <li>✔ 1,500 chats / month</li>
            <li>✔ Human-style AI</li>
            <li>✔ Hot lead detection</li>
            <li>✔ Daily summaries</li>
          </ul>
          <a className="cta" href="/signup">Get Started</a>
        </div>

        {/* BUSINESS */}
        <div className="glass" style={{ padding: 32 }}>
          <h2>$49</h2>
          <p>Business</p>
          <ul>
            <li>✔ Unlimited chats</li>
            <li>✔ Priority AI</li>
            <li>✔ Full automation</li>
          </ul>
          <button className="cta" disabled>
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
