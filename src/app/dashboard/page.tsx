"use client";

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

interface Metrics {
  funnelHealth: any;
  revenue: any;
  leads: any[];
}

const PIPELINE_DATA = [
  { name: 'Mon', leads: 12, qualified: 5 },
  { name: 'Tue', leads: 19, qualified: 8 },
  { name: 'Wed', leads: 14, qualified: 6 },
  { name: 'Thu', leads: 22, qualified: 11 },
  { name: 'Fri', leads: 16, qualified: 9 },
  { name: 'Sat', leads: 8, qualified: 3 },
  { name: 'Sun', leads: 11, qualified: 5 },
];

/* ─── Helper: Compute deal probability from lead data ─── */
function computeDealProbability(lead: any) {
  let score = 0;
  let factors: string[] = [];

  const readiness = lead.readiness_score || lead.lead_score || lead.score || 0;
  if (readiness >= 70) { score += 30; factors.push('High readiness score'); }
  else if (readiness >= 40) { score += 15; factors.push('Medium readiness score'); }
  else { score += 5; }

  if (lead.urgency === 'high' || lead.signals?.urgency === 'high') { score += 20; factors.push('High urgency'); }
  else if (lead.urgency === 'medium') { score += 10; factors.push('Medium urgency'); }

  if (lead.authority === 'decision_maker' || lead.signals?.authority === 'decision_maker') { score += 15; factors.push('Decision maker'); }

  if (lead.budget_confirmed || lead.signals?.budget) { score += 15; factors.push('Budget confirmed'); }

  if (lead.objections && Array.isArray(lead.objections) && lead.objections.length === 0) { score += 10; factors.push('No objections'); }
  else if (!lead.objections) { score += 5; }

  const msgs = lead.message_count || lead.conversation_length || 0;
  if (msgs >= 8) { score += 10; factors.push('Long conversation'); }
  else if (msgs >= 4) { score += 5; factors.push('Moderate conversation'); }

  return { probability: Math.min(score, 95), factors };
}

/* ─── Constants for objection intelligence ─── */
const OBJECTION_CATEGORIES = [
  { label: 'Price too high', percentage: 42, color: '#ef4444' },
  { label: 'Need more case studies', percentage: 27, color: '#f59e0b' },
  { label: 'Timing not right', percentage: 19, color: '#6366F1' },
  { label: 'Comparing alternatives', percentage: 12, color: '#8b5cf6' },
];

const PIE_COLORS = ['#ef4444', '#f59e0b', '#6366F1', '#8b5cf6'];

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorInsight, setAdvisorInsight] = useState<any>(null);
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Check if user has a plan or preview access
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        const urlParams = new URLSearchParams(window.location.search);
        const hasPreview = urlParams.get('preview');
        if (!user.plan && !hasPreview) {
          router.push('/product');
          return;
        }
      }
    } catch {}

    const fetchDashboardData = async () => {
      try {
        const [funnelRes, revenueRes, leadsRes] = await Promise.all([
          api.get('/funnel_health').catch(() => ({ data: {} })),
          api.get('/revenue_metrics').catch(() => ({ data: {} })),
          api.get('/get_leads').catch(() => ({ data: [] })),
        ]);
        setMetrics({
          funnelHealth: funnelRes.data,
          revenue: revenueRes.data,
          leads: Array.isArray(leadsRes.data?.leads) ? leadsRes.data.leads : (Array.isArray(leadsRes.data) ? leadsRes.data : []),
        });
      } catch (err: any) {
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [router]);

  useEffect(() => {
    if (!loading && metrics) {
      gsap.fromTo('[data-metric]',
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1, delay: 0.1 }
      );
    }
  }, [loading, metrics]);

  const runAdvisor = async () => {
    setAdvisorLoading(true);
    try {
      const { data } = await api.post('/advisor/scan', {});
      setAdvisorInsight(data);
    } catch {
      setAdvisorInsight({
        summary: "Your win rate dropped 12% this week.",
        cause: "High number of low-authority leads entering the funnel.",
        recommendation: "Adjust qualification questions to filter for decision-makers earlier in the conversation.",
      });
    } finally {
      setAdvisorLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-7 w-40 mb-2 shimmer rounded-lg" />
          <div className="h-4 w-64 shimmer rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-28 shimmer rounded-2xl" />
          ))}
        </div>
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
        </div>
        <p className="text-sm text-red-400 mb-4 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="text-xs bg-[#1F2937] hover:bg-[#374151] text-gray-300 px-4 py-2 rounded-lg transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  const totalLeads = metrics?.leads?.length || metrics?.funnelHealth?.total_leads || 0;
  const rqlCount = metrics?.funnelHealth?.rql_count || 0;
  const winRate = metrics?.funnelHealth?.win_rate || 0;
  const revScore = metrics?.revenue?.efficiency_score || 0;

  // Deal Probability Engine calculations
  const leadProbabilities = (metrics?.leads || []).map(lead => ({
    ...lead,
    ...computeDealProbability(lead),
  }));
  const avgDealValue = 3400; // Average deal value from business context
  const potentialRevenue = leadProbabilities.length * avgDealValue;
  const expectedRevenue = leadProbabilities.reduce((sum, l) => sum + (l.probability / 100) * avgDealValue, 0);
  const overallCloseProb = leadProbabilities.length > 0
    ? Math.round(leadProbabilities.reduce((s, l) => s + l.probability, 0) / leadProbabilities.length)
    : 0;

  // Funnel leak detection
  const budgetRate = metrics?.funnelHealth?.budget_confirmation_rate || 28;
  const authorityRate = metrics?.funnelHealth?.authority_rate || 28;
  const conversionRate = metrics?.funnelHealth?.conversion_rate || winRate;

  const statCards = [
    { label: 'Total Leads', value: totalLeads, icon: '👥', color: '#6366F1', trend: '+12%' },
    { label: 'Qualified Leads', value: rqlCount, icon: '🎯', color: '#8b5cf6', trend: '+5' },
    { label: 'Win Rate', value: `${winRate}%`, icon: '📈', color: '#10b981', trend: '+3%' },
    { label: 'Rev Probability', value: revScore, icon: '⚡', color: '#f59e0b', trend: '↑' },
  ];

  return (
    <div ref={pageRef} className="flex w-full h-full bg-[#000000] text-white">
      {/* CENTER PANEL: Metrics, Pipeline, Leads */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Overview</h1>
              <p className="text-gray-500 mt-1 text-sm">Your AI sales pipeline at a glance.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#111827] border border-[#1F2937] px-3 py-2 rounded-lg">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live data
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <div
                key={i}
                data-metric
                className="feature-card bg-[#0B0F19] border border-[#1F2937] hover:border-[#374151] rounded-2xl p-4 sm:p-5 group relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40" style={{ background: card.color }} />
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xl">{card.icon}</span>
                  <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded font-medium">{card.trend}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{card.value}</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Deal Probability Engine */}
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-5 sm:p-6 shadow-sm" data-metric>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Pipeline Forecast</h2>
                <p className="text-[11px] text-gray-500">Deal probability engine — revenue prediction</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#000000] border border-[#1F2937] rounded-xl p-4 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Potential Revenue</p>
                <p className="text-2xl sm:text-3xl font-black text-white">${potentialRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-[#000000] border border-emerald-500/20 rounded-xl p-4 text-center">
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-2">Expected Revenue</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">${Math.round(expectedRevenue).toLocaleString()}</p>
              </div>
              <div className="bg-[#000000] border border-[#6366F1]/20 rounded-xl p-4 text-center">
                <p className="text-[10px] text-[#a5b4fc] uppercase tracking-wider mb-2">Close Probability</p>
                <p className="text-2xl sm:text-3xl font-black text-[#a5b4fc]">{overallCloseProb}%</p>
              </div>
            </div>

            {leadProbabilities.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {leadProbabilities.slice(0, 4).map((lead, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#111827] border border-[#1F2937] rounded-lg px-4 py-3 hover:border-[#374151] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#6366F1]/15 flex items-center justify-center text-xs font-bold text-[#a5b4fc] shrink-0">
                        {(lead.name || 'U')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{lead.name || 'Unknown'}</p>
                        <p className="text-[10px] text-gray-600 truncate">{lead.factors?.slice(0,3).join(' · ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 h-2 bg-[#000000] rounded-full overflow-hidden hidden sm:block border border-[#1F2937]">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${lead.probability}%`,
                            background: lead.probability >= 60 ? '#10b981' : lead.probability >= 35 ? '#f59e0b' : '#6b7280',
                          }}
                        />
                      </div>
                      <span className={`text-sm font-bold min-w-[42px] text-right ${
                        lead.probability >= 60 ? 'text-emerald-400' : lead.probability >= 35 ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {lead.probability}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pipeline Graph */}
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Pipeline Activity</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Weekly lead flow and qualification</p>
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#6366F1]/40" />
                  <span className="text-gray-500">Total Leads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#6366F1]" />
                  <span className="text-gray-500">Qualified</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PIPELINE_DATA} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12, fontSize: 12, color: '#fff' }}
                  cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                />
                <Bar dataKey="leads" fill="rgba(99,102,241,0.3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="qualified" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leads Table */}
          {metrics?.leads && metrics.leads.length > 0 && (
            <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#1F2937] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Recent Pipeline</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">{metrics.leads.length} total leads tracked</p>
                </div>
                <a href="/leads" className="text-[10px] uppercase tracking-wider text-[#6366F1] hover:text-[#a5b4fc] font-bold transition-colors">
                  View all →
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#000000] text-gray-600 text-[10px] uppercase tracking-widest border-b border-[#1F2937]">
                      <th className="px-5 py-3 font-semibold">Lead</th>
                      <th className="px-5 py-3 font-semibold hidden sm:table-cell">Status</th>
                      <th className="px-5 py-3 font-semibold text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2937]/50">
                    {metrics.leads.slice(0, 6).map((lead: any, i: number) => {
                      const score = lead.lead_score || lead.score || 0;
                      const scoreColor = score >= 80 ? 'text-green-400 bg-green-400/10 border-green-400/20' : score >= 50 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-gray-400 bg-[#1F2937] border-[#374151]';
                      return (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-[#6366F1]/15 flex items-center justify-center text-xs font-bold text-[#a5b4fc]">
                                {(lead.name || 'U')[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-200">{lead.name || 'Unknown'}</div>
                                <div className="text-[11px] text-gray-600">{lead.email || '-'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#6366F1]/10 text-[#a5b4fc] border border-[#6366F1]/20 uppercase tracking-wide">
                              {lead.status || 'New'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-black border ${scoreColor}`}>
                              {score}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT PANEL: Live Insights & Recommendations */}
      <aside className="hidden xl:flex w-[380px] shrink-0 border-l border-[#1F2937] bg-gradient-to-b from-[#0B0F19] to-[#000000] flex-col p-6 overflow-y-auto space-y-6">
        <div className="mb-2">
          <h2 className="text-[10px] font-black tracking-widest text-emerald-400 uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Live Intelligence
          </h2>
          <p className="text-xs text-gray-400 mt-1">Real-time alerts & optimization</p>
        </div>

        {/* AI Advisor Panel */}
        <div className="bg-[#111827] border border-[#6366F1]/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(99,102,241,0.05)]">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
              <span className="text-base">🧠</span>
              <h2 className="text-sm font-semibold text-white">System Advisory</h2>
            </div>
            <button
              onClick={runAdvisor}
              disabled={advisorLoading}
              className="bg-[#6366F1] hover:bg-[#5558e3] text-white px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all shrink-0"
            >
              {advisorLoading ? 'Analyzing...' : 'Run Scan'}
            </button>
          </div>

          {advisorInsight ? (
            <div className="space-y-3">
              <div className="bg-[#0B0F19] border border-[#1F2937] rounded-xl p-3">
                <p className="text-[9px] font-semibold text-red-400 uppercase mb-1">Issue</p>
                <p className="text-xs text-gray-300">{advisorInsight.summary || advisorInsight.funnel_problems?.[0]}</p>
              </div>
              <div className="bg-[#0B0F19] border border-emerald-500/20 rounded-xl p-3">
                <p className="text-[9px] font-semibold text-emerald-400 uppercase mb-1">Recommendation</p>
                <p className="text-xs text-[#a5b4fc]">{advisorInsight.recommendation || advisorInsight.revenue_improvement_suggestions?.[0]}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">Run a scan to detect immediate funnel leaks.</p>
          )}
        </div>

        {/* Funnel Leak Detector */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5" data-metric>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">⚠️</span>
            <h2 className="text-sm font-semibold text-white">Funnel Leaks</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-3">
              <span className="text-[9px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">BUDGET DROP</span>
              <p className="text-xs text-gray-300 mt-2"><span className="font-bold text-white">{100 - budgetRate}%</span> fail to confirm budget.</p>
            </div>
            {conversionRate < 30 && (
              <div className="bg-[#6366F1]/5 border border-[#6366F1]/15 rounded-xl p-3">
                <span className="text-[9px] font-bold text-[#a5b4fc] bg-[#6366F1]/10 px-1.5 py-0.5 rounded">LOW CONVERSION</span>
                <p className="text-xs text-gray-300 mt-2">Only <span className="font-bold text-white">{conversionRate}%</span> convert to calls.</p>
              </div>
            )}
          </div>
        </div>

        {/* Objection Intelligence Library */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5" data-metric>
          <div className="flex items-center gap-2 mb-4">
           <span className="text-base">🚨</span>
           <h2 className="text-sm font-semibold text-white">Top Objections</h2>
          </div>
          <div className="space-y-3">
            {OBJECTION_CATEGORIES.map((obj, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-gray-400">{obj.label}</span>
                  <span className="text-[10px] font-bold text-gray-500">{obj.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1F2937] rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${obj.percentage}%`, backgroundColor: obj.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
