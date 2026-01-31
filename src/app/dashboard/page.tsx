"use client";
import { useEffect, useRef, useState } from "react";
import { XANO_BASE } from "@/lib/apiConfig";

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
  type BusinessProfile = {
  id?: number;
  business_id?: number;
  plan?: string;
};

const [profile, setProfile] = useState<BusinessProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<{
    total_chats: number;
    hot_count: number;
    warm_count: number;
    cold_count: number;
    ai_closed_count: number;
    note?: string;
  } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const fetchedSummaryRef = useRef(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("https://xano.example.com/business/profile");
        const data = await res.json();
        setProfile(data);
      } catch {
        setError("Failed to load usage info");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function fetchDailySummary(businessId: string) {
    if (!businessId) return;
    setSummaryLoading(true);
    setSummaryError(false);
    try {
      const res = await fetch(`${XANO_BASE}/api:t4vcaTEd/generate_daily_summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: businessId }),
      });

      if (!res.ok) throw new Error("summary request failed");

      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Daily summary error", err);
      setSummaryError(true);
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }

  // Fetch summary once after profile loads (do not call on every render)
  useEffect(() => {
    const businessId = profile?.id || profile?.business_id;
    if (!businessId) return;
    if (fetchedSummaryRef.current) return;
    fetchedSummaryRef.current = true;
    fetchDailySummary(businessId);
  }, [profile]);

  let usageWarning = null;
  let usageExceeded = false;
  if (profile) {
    const limit = getLimit(profile.plan_name);
    const used = profile.messages_used;
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
            fetchDailySummary(businessId);
          }}>Refresh</button>
        </div>
      </div>

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
          {profile && getLimit(profile.plan_name) !== Infinity && (
            <div className="muted">Limit: {getLimitText(profile.plan_name)}</div>
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
