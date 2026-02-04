"use client";

export default function Home() {
  return (
    <div className="page">
      
      {/* HERO */}
      <section style={{ marginBottom: 120 }}>
        <h1>
          Never Lose Another Lead.
          <br />
          <span style={{ color: "#7c3aed" }}>Auto Closure</span> Closes While You Sleep.
        </h1>

        <p style={{ maxWidth: 600, marginTop: 20 }}>
          Auto Closure AI replies instantly like a real human, qualifies buyers,
          and converts conversations into revenue — 24/7.
        </p>

        <a className="cta" href="/pricing">
          Get Your Free AI Link
        </a>

        <p style={{ marginTop: 12, fontSize: 14, opacity: 0.6 }}>
          No credit card • Setup in 2 minutes • Works today
        </p>
      </section>

      {/* TRUST METRICS */}
      <section className="glass" style={{ padding: 40, marginBottom: 100 }}>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          <div>
            <h2>24/7</h2>
            <p>Instant Replies</p>
          </div>
          <div>
            <h2>Human</h2>
            <p>Sales Conversations</p>
          </div>
          <div>
            <h2>$1M+</h2>
            <p>Revenue Closed</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ marginBottom: 120 }}>
        <h2>How Auto Closure Works</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginTop: 32 }}>
          <div className="glass" style={{ padding: 28 }}>
            <h3>1. Create Your Profile</h3>
            <p>Tell us what you sell, pricing, and tone. One-time setup.</p>
          </div>

          <div className="glass" style={{ padding: 28 }}>
            <h3>2. Share Your Link</h3>
            <p>Put it in bio, WhatsApp, website — anywhere.</p>
          </div>

          <div className="glass" style={{ padding: 28 }}>
            <h3>3. AI Closes for You</h3>
            <p>Replies, qualifies, and flags hot buyers automatically.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="glass" style={{ padding: 48, textAlign: "center" }}>
        <h2>Let AI Handle Your DMs</h2>
        <p>Focus on growth while Auto Closure handles conversations.</p>
        <a className="cta" href="/pricing">
          Start Free Now
        </a>
      </section>

    </div>
  );
}
