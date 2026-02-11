"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

const businessTypes = [
  "Restaurant",
  "Retail",
  "Service",
  "Healthcare",
  "Education",
  "Other",
];

const tones = [
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Salesy", value: "salesy" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: "",
    business_type: businessTypes[0],
    description: "",
    services: "",
    faqs: "",
    tone: tones[0].value,
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
      // Get selected plan from localStorage
      const selectedPlan = localStorage.getItem("selected_plan") || "pro";
      const { apiRequest } = await import("@/lib/api");
      const payload = {
        what_business_does: form.description || form.business_type,
        what_you_sell: form.services,
        pricing_range: form.faqs || "",
        tone: form.tone,
        extra_instructions: "",
        plan_name: selectedPlan,
        business_name: form.business_name,
      };

      const resp = await apiRequest("/update_profile", "POST", payload, true);
      console.log("update_profile response:", resp);
      if (!resp.ok) throw new Error(resp.data?.message || `Failed to submit: ${resp.status}`);

      // Save basic profile info locally for dashboard display
      const profile = resp.data || {};
      localStorage.removeItem("selected_plan");
      try { localStorage.setItem("profile", JSON.stringify(profile)); } catch {}
      router.push("/product");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#ff6b6b', marginBottom: 16 }}>Error</h2>
        <p style={{ fontSize: '1.1rem', color: '#a0a0a6', marginBottom: 24 }}>{error}</p>
        <a href="/" style={{ color: '#8b5cf6', textDecoration: 'underline' }}>← Back to home</a>
      </div>
    );
  }
  return (
    <div className="container" style={{paddingTop:28,paddingBottom:28}}>
      <div className="stage" aria-hidden />
      <div className="glass" style={{maxWidth:720,margin:'0 auto',padding:20}}>
        <h1 style={{margin:0}}>Tell us about your business</h1>
        <p className="muted">We’ll train the assistant to match your voice. One step at a time.</p>

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12,marginTop:12}}>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label className="kicker">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              className="glass"
              style={{padding:12,borderRadius:10,border:'none'}}
              required
            />
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label className="kicker">Business Type</label>
            <select
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
              className="glass"
              style={{padding:12,borderRadius:10,border:'none'}}
              required
            >
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label className="kicker">Short description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="glass"
              style={{padding:12,borderRadius:10,border:'none'}}
              rows={3}
              required
            />
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label className="kicker">Services (comma separated)</label>
            <textarea
              name="services"
              value={form.services}
              onChange={handleChange}
              className="glass"
              style={{padding:12,borderRadius:10,border:'none'}}
              rows={2}
              required
            />
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label className="kicker">FAQs</label>
            <textarea
              name="faqs"
              value={form.faqs}
              onChange={handleChange}
              className="glass"
              style={{padding:12,borderRadius:10,border:'none'}}
              rows={2}
              required
            />
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <label className="kicker">Tone of Assistant</label>
            <select
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="glass"
              style={{padding:12,borderRadius:10,border:'none'}}
              required
            >
              {tones.map((tone) => (
                <option key={tone.value} value={tone.value}>{tone.label}</option>
              ))}
            </select>
          </div>

          {error && <div style={{color:'#ff6b6b',fontSize:13}}>{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
    </div>
  );
}
