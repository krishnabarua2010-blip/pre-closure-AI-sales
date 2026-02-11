"use client";
import { useEffect, useRef, useState } from "react";
import { XANO_BASE } from "@/lib/apiConfig";
import { Profile, DailySummary, Features } from "@/lib/types";
import { saveFeaturestoStorage } from "@/lib/useFeaturesStore";

function getLimitText(plan: string) {
  if (plan === "Basic") return "200 / month";
  if (plan === "Pro") return "1500 / month";
  return "Unlimited";
}

function getLimit(plan: string) {
  if (plan === "Basic") return 200;
  if (plan === "Pro") return 1500;
  return Infinity;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const [features, setFeatures] = useState<Features | null>(null);
  const [newlyUnlockedFeatures, setNewlyUnlockedFeatures] = useState<string[]>([]);
  const fetchedSummaryRef = useRef(false);
  const fetchedFeaturesRef = useRef(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Try local cache first
        const cached = typeof window !== "undefined" ? localStorage.getItem("profile") : null;
        if (cached) {
          setProfile(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const { apiRequest } = await import("@/lib/api");
        const resp = await apiRequest("/business_profile", "GET", undefined, true);
        if (resp.ok) {
          setProfile(resp.data);
          try { localStorage.setItem("profile", JSON.stringify(resp.data)); } catch {}
        } else {
          setError("Failed to load usage info");
        }
      } catch (err) {
        setError("Failed to load usage info");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function fetchDailySummary(businessId: string) {
    const id = String(businessId);
    if (!id) return;
    setSummaryLoading(true);
    setSummaryError(false);
    try {
      const { apiRequest } = await import("@/lib/api");
      const resp = await apiRequest("/api:t4vcaTEd/generate_daily_summary", "POST", { business_id: id }, true);
      if (!resp.ok) throw new Error("summary request failed");
      setSummary(resp.data);
    } catch (err) {
      console.error("Daily summary error", err);
      setSummaryError(true);
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }

  async function fetchFeatures(planName: string) {
    try {
      const { apiRequest } = await import("@/lib/api");
      const resp = await apiRequest("/api:features-check", "POST", { plan: planName }, true);

      if (!resp.ok) throw new Error("features request failed");

      const data = resp.data;
      
      // Check which features are newly unlocked (were not in localStorage)
      const previousFeaturesStr = localStorage.getItem("previous-features");
      const previousFeatures = previousFeaturesStr ? JSON.parse(previousFeaturesStr) : {};
      
      const newlyUnlocked = Object.keys(data).filter(
        (key) => data[key] && !previousFeatures[key]
      );
      
      setFeatures(data);
      setNewlyUnlockedFeatures(newlyUnlocked);
      saveFeaturestoStorage(data);
      
      // Store current features for next comparison
      localStorage.setItem("previous-features", JSON.stringify(data));
    } catch (err) {
      console.error("Features fetch error", err);
      // Fallback: set basic features based on plan
      const basicFeatures: Features = {
        memory_v2: planName === "Pro" || planName === "Business",
        advanced_analytics: planName === "Business",
        priority_support: planName === "Business",
        custom_automations: planName === "Pro" || planName === "Business",
      };
      setFeatures(basicFeatures);
      saveFeaturestoStorage(basicFeatures);
    }
  }

  // Fetch summary once after profile loads (do not call on every render)
  useEffect(() => {
    const businessId = profile?.id || profile?.business_id;
    if (!businessId) return;
    if (fetchedSummaryRef.current) return;
    fetchedSummaryRef.current = true;
    fetchDailySummary(String(businessId));
  }, [profile]);

  // Fetch features once after profile loads
  useEffect(() => {
    const planName = profile?.plan_name;
    if (!planName) return;
    if (fetchedFeaturesRef.current) return;
    fetchedFeaturesRef.current = true;
    fetchFeatures(planName);
  }, [profile]);

  // Guard: Show loading if data not yet available
  if (loading || !profile) {
    return (
      <section className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#d1d1d6' }}>Loading your workspace…</p>
      </section>
    );
  }

  // Guard: Check if profile has required fields
  if (!profile.business_name || !profile.plan_name) {
    return (
      <section className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#d1d1d6', marginBottom: 16 }}>Please complete setup or payment to continue.</h2>
        <p style={{ fontSize: '1.1rem', color: '#a0a0a6', marginBottom: 24 }}>Set up your business profile and choose a plan to access your dashboard.</p>
        <a href="/onboarding" style={{ color: '#8b5cf6', textDecoration: 'underline', fontSize: '1rem' }}>← Complete onboarding</a>
      </section>
    );
  }

  if (error && !profile) {
    return (
      <section className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#ff6b6b' }}>{error}</p>
      </section>
    );
  }

  let usageWarning = null;
  let usageExceeded = false;
  if (profile) {
    const limit = getLimit(profile.plan_name || '');
    const used = profile.messages_used ?? 0;
    if (limit !== Infinity) {
      const percent = used / limit;
      if (percent >= 1) usageExceeded = true;
      else if (percent >= 0.8) usageWarning = true;
    }
  }

  return (
    <section className="container">
      <div className="stage" aria-hidden />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:18}}>
        <div>
          <h2 style={{margin:0}}>Dashboard</h2>
          <p className="muted">AI handled conversations today — you review hot leads.</p>
        </div>
        <div>
          <button className="btn btn-ghost" onClick={() => {
            const businessId = profile?.id || profile?.business_id;
            fetchDailySummary(String(businessId));
          }}>Refresh</button>
        </div>
      </div>

      {/* NEWLY UNLOCKED FEATURES BANNER */}
      {newlyUnlockedFeatures.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            color: "#d1d1d6",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>✨</span>
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              New feature unlocked!
            </div>
            <div style={{ fontSize: "0.9rem", color: "#a0a0a6" }}>
              {newlyUnlockedFeatures
                .map((f) => f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
                .join(", ")}{" "}
              is now available on your {profile?.plan_name} plan.
            </div>
          </div>
        </div>
      )}

      <div className="cards" style={{marginBottom:16}}>
        <div className="glass" style={{padding:16}}>
          <div className="kicker">Plan</div>
          <div style={{fontSize:20,fontWeight:700}}>{profile?.plan_name || '-'}</div>
          <div className="muted">{getLimitText(profile?.plan_name || '')}</div>
        </div>

        <div className="glass neon-outline" style={{padding:16}}>
          <div className="kicker">Usage</div>
          <div style={{fontSize:28,fontWeight:800}}>{profile?.messages_used ?? '-'}</div>
          <div className="muted">Messages used this month</div>
          {profile && getLimit(profile.plan_name || '') !== Infinity && (
            <div className="muted">Limit: {getLimitText(profile?.plan_name || '')}</div>
          )}
          {usageWarning && !usageExceeded && (
            <div style={{color:'#ffb86b',fontWeight:700,marginTop:8}}>Near limit</div>
          )}
          {usageExceeded && (
            <div style={{color:'#ff6b6b',fontWeight:700,marginTop:8}}>Upgrade to continue receiving chats</div>
          )}
        </div>

        <div className="glass" style={{padding:16}}>
          <div className="kicker">Notifications</div>
          <div className="muted">Email notifications for hot leads coming soon.</div>
        </div>
      </div>

      <div className="cards">
        <div className="glass" style={{padding:16}}>
          <div className="kicker">Today's Activity</div>
          {summaryLoading ? (
            <p className="muted">Loading summary…</p>
          ) : summaryError ? (
            <p className="muted">Summary unavailable</p>
          ) : summary ? (
            <>
              <div style={{fontSize:18,fontWeight:700}}>Total chats: {summary.total_chats}</div>
              <div className="muted">HOT: {summary.hot_count} • WARM: {summary.warm_count} • COLD: {summary.cold_count}</div>
            </>
          ) : (
            <p className="muted">Summary not available</p>
          )}
        </div>

        <div className="glass" style={{padding:16}}>
          <div className="kicker">AI Performance</div>
          {summary ? (
            <div className="muted">AI closed {summary.ai_closed_count} hot leads</div>
          ) : (
            <div className="muted">Summary unavailable</div>
          )}
        </div>

        <div className="glass" style={{padding:16}}>
          <div className="kicker">Manager Note</div>
          {summary ? (
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div className="muted">{summary.note || '-'}</div>
              {summary.note && /needs owner attention/i.test(summary.note) && (
                <span style={{background:'#ff6b6b',color:'#fff',padding:'4px 8px',borderRadius:8}}>Needs attention</span>
              )}
            </div>
          ) : (
            <div className="muted">Summary unavailable</div>
          )}
        </div>
      </div>

      {loading && <div className="muted" style={{marginTop:12}}>Loading...</div>}
      {error && <div className="muted" style={{marginTop:12,color:'#ff6b6b'}}>{error}</div>}
    </section>
  );
}
