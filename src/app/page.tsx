"use client";

export default function Home() {
  return (
    <div className="page">
      {/* HERO */}
      <section style={{ marginBottom: 80 }} className="fade-up">
        <h1 style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', margin: 0 }} className="gradient-text">Auto Closure</h1>
        <div className="hero-tagline">Your best salesperson, available 24/7.</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 12 }}>The world's most human AI sales assistant for businesses</h2>

        <p style={{ maxWidth: 720, marginTop: 18, fontSize: '1.05rem' }}>
          Replies instantly, sounds real, qualifies buyers, and closes deals for you — 24/7.
        </p>

        <div className="gradient-text" style={{ fontSize: '1.1rem', marginTop: 20, fontStyle: 'italic' }}>
          Not a chatbot. A real conversation engine.
        </div>

        <a className="cta" href="/pricing">
          View Pricing
        </a>
      </section>

      {/* TRUST METRICS */}
      <section className="glass fade-up" style={{ padding: 28, marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h2>Trusted by 500+ businesses</h2>
            <p style={{ marginTop: 6 }}>$1.2M+ revenue generated</p>
          </div>
        </div>
      </section>

      <div className="quote fade-up" style={{ marginBottom: 60 }}>Missed messages are missed money. Auto Closure never sleeps.</div>

      {/* HOW IT WORKS (4 STEPS) */}
      <section style={{ marginBottom: 40 }} className="fade-up">
        <h2>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 24 }}>
          <div className="glass fade-up" style={{ padding: 28 }}>
            <h3 style={{ fontSize: '1.15rem' }}>1. Choose a plan</h3>
            <p style={{ marginTop: 8 }}>Select a monthly plan that matches your business size and traffic.</p>
          </div>

          <div className="glass fade-up" style={{ padding: 28 }}>
            <h3 style={{ fontSize: '1.15rem' }}>2. Set up your business profile</h3>
            <p style={{ marginTop: 8 }}>Tell Auto Closure what you sell, pricing, FAQs, and the tone you want it to use.</p>
          </div>

          <div className="glass fade-up" style={{ padding: 28 }}>
            <h3 style={{ fontSize: '1.15rem' }}>3. Get your private chat link</h3>
            <p style={{ marginTop: 8 }}>We generate a unique, private link you can add to your site, bio, or messaging apps.</p>
          </div>

          <div className="glass fade-up" style={{ padding: 28 }}>
            <h3 style={{ fontSize: '1.15rem' }}>4. AI handles conversations & closes leads</h3>
            <p style={{ marginTop: 8 }}>The AI replies like a human, qualifies buyers, and flags hot leads for your team.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials fade-up" style={{ marginBottom: 40 }}>
        <h2>What customers say</h2>
        <div className="testimonial-grid" style={{ marginTop: 16 }}>
          <div className="glass testimonial-card fade-up">
            <strong>Maria Lopez</strong>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Ecommerce manager</div>
            <p style={{ marginTop: 10 }}>Auto Closure handled our busiest weekends and kept lead response under 30s. Our conversion rates improved noticeably.</p>
          </div>
          <div className="glass testimonial-card fade-up">
            <strong>Omar Khan</strong>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Digital agency</div>
            <p style={{ marginTop: 10 }}>The AI mirrors our tone and filters real opportunities — saves our team hours every week.</p>
          </div>
          <div className="glass testimonial-card fade-up">
            <strong>Sarah Nguyen</strong>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Course creator</div>
            <p style={{ marginTop: 10 }}>We closed deals overnight that would otherwise be lost. Setup was quick and results were immediate.</p>
          </div>
        </div>
      </section>

      <div className="quote fade-up" style={{ marginBottom: 60 }}>Speed wins deals. Humans buy from humans — Auto Closure sounds human.</div>

      {/* PRICING */}
      <section style={{ marginBottom: 40 }} className="fade-up">
        <h2>Plans</h2>
        <div className="pricing-grid" style={{ marginTop: 16 }}>
          <div className="glass price-card fade-up">
            <div className="price-badge">Anchor</div>
            <h3>$49</h3>
            <p style={{ opacity: 0.8 }}>Business — Unlimited</p>
            <ul style={{ textAlign: 'left' }}>
              <li>Priority routing and human handoff</li>
              <li>Unlimited conversations</li>
              <li>Custom integrations</li>
            </ul>
            <a className="cta" href="/signup">Start Business</a>
          </div>
          <div className="glass price-card most-popular fade-up">
            <div className="price-badge">Most popular</div>
            <h3>$29</h3>
            <p style={{ opacity: 0.85 }}>Pro — Best for growing teams</p>
            <ul style={{ textAlign: 'left' }}>
              <li>Up to 10k messages / month</li>
              <li>Priority replies and templates</li>
              <li>Performance reporting</li>
            </ul>
            <a className="cta" href="/signup">Choose Pro</a>
          </div>
          <div className="glass price-card fade-up">
            <div className="price-badge">Limited</div>
            <h3>$19</h3>
            <p style={{ opacity: 0.85 }}>Starter — Small teams</p>
            <ul style={{ textAlign: 'left' }}>
              <li>Up to 1k messages / month</li>
              <li>Basic templates</li>
              <li>Email support</li>
            </ul>
            <a className="cta" href="/signup">Get Starter</a>
          </div>
        </div>
      </section>

      {/* FINAL CTA + SCARCITY */}
      <section className="final-cta glass fade-up" style={{ textAlign: 'center' }}>
        <h2>Limited beta access</h2>
        <p style={{ marginTop: 8 }}>Apply for limited access — spots are limited to keep onboarding personal.</p>
        <div style={{ marginTop: 16 }}>
          <a className="big-cta" href="/signup">Apply for Beta</a>
        </div>
      </section>

    </div>
  );
}
