"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types";

const tones = [
  { label: "Friendly", value: "friendly" },
  { label: "Professional", value: "professional" },
  { label: "Salesy", value: "salesy" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    description: "",
    services: "",
    faqs: "",
    tone: tones[0].value,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("https://xano.example.com/business/profile");
        const data = await res.json();
        setProfile(data);
        setForm({
          description: data.description || "",
          services: data.services || "",
          faqs: data.faqs || "",
          tone: data.tone || tones[0].value,
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://xano.example.com/business/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setEditMode(false);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Guard: Show loading if profile not yet available
  if (loading || !profile) {
    return (
      <div className="container" style={{ padding: 60, textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#d1d1d6' }}>Loading your profile…</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container" style={{ padding: 60, textAlign: 'center', color: '#ff6b6b' }}>
        <p style={{ fontSize: '1.1rem' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{paddingTop:28,paddingBottom:28}}>
      <div className="stage" aria-hidden />
      <div className="glass" style={{maxWidth:760,margin:'0 auto',padding:20}}>
        <h1 style={{margin:0}}>Business Profile</h1>
        {profile && !editMode ? (
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:12}}>
            <div><strong>{profile.business_name}</strong></div>
            <div className="muted">Slug: <span style={{background:'rgba(255,255,255,0.03)',padding:'4px 8px',borderRadius:6}}>{profile.slug}</span></div>
            <div className="muted">Plan: {profile.plan_name}</div>
            <div className="muted">Messages used: {profile.messages_used}</div>
            <div style={{marginTop:8}}><div className="kicker">Description</div><div className="muted">{profile.description}</div></div>
            <div><div className="kicker">Services</div><div className="muted">{profile.services}</div></div>
            <div><div className="kicker">FAQs</div><div className="muted">{profile.faqs}</div></div>
            <div><div className="kicker">Tone</div><div className="muted">{profile.tone}</div></div>
            <div style={{marginTop:12}}>
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12,marginTop:12}}>
            <div>
              <label className="kicker">Description</label>
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
            <div>
              <label className="kicker">Services</label>
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
            <div>
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
            <div>
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
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
