"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  follow_up_immediately: { label: 'Follow Up Now', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  send_proposal: { label: 'Send Proposal', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  nurture_later: { label: 'Nurture Later', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  ignore: { label: 'Low Priority', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
};

const QUAL_COLORS: Record<string, string> = {
  HIGH: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  MEDIUM: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  LOW: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await api.get('/analytics/leads');
        setLeads(data?.leads || data || []);
      } catch (err: any) {
        setError('Failed to load leads.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const q = searchQuery.toLowerCase();
    return !q || 
      (lead.name || '').toLowerCase().includes(q) || 
      (lead.email || '').toLowerCase().includes(q) ||
      (lead.qualification_level || '').toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 overflow-y-auto h-full">
        <div className="h-7 w-40 shimmer rounded-lg" />
        <div className="h-4 w-64 shimmer rounded-lg" />
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <div key={i} className="h-20 shimmer rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* LEFT: Leads List */}
      <div className={`${selectedLead ? 'hidden lg:flex' : 'flex'} flex-col flex-1 p-6 lg:p-8 overflow-y-auto`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Lead Intelligence</h1>
          <p className="text-gray-500 text-sm">{leads.length} leads tracked · AI-analyzed in real-time</p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or qualification..."
            className="w-full bg-[#0B0F19] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6366F1] transition-colors"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm mb-4">{error}</div>
        )}

        {/* Lead Cards */}
        <div className="space-y-3">
          {filteredLeads.length === 0 && (
            <div className="text-center py-16 text-gray-500 text-sm">
              {searchQuery ? 'No leads match your search.' : 'No leads captured yet. Share your widget to start.'}
            </div>
          )}

          {filteredLeads.map((lead: any, i: number) => {
            const qual = lead.qualification_level || 'LOW';
            const action = ACTION_LABELS[lead.recommended_action] || ACTION_LABELS.nurture_later;
            const isSelected = selectedLead?.id === lead.id;

            return (
              <div
                key={lead.id || i}
                onClick={() => setSelectedLead(lead)}
                className={`bg-[#0B0F19] border rounded-xl p-4 cursor-pointer transition-all hover:border-[#374151] ${
                  isSelected ? 'border-[#6366F1] shadow-lg shadow-[#6366F1]/10' : 'border-[#1F2937]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#6366F1]/15 flex items-center justify-center text-sm font-bold text-[#a5b4fc] shrink-0">
                      {(lead.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{lead.name || 'Unknown'}</p>
                      <p className="text-[11px] text-gray-500 truncate">{lead.email || 'No email'}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide shrink-0 ${QUAL_COLORS[qual] || QUAL_COLORS.LOW}`}>
                    {qual}
                  </span>
                </div>

                {/* Score Bars */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <ScoreBar label="Intent" value={lead.intent_score || 0} max={10} />
                  <ScoreBar label="Budget" value={lead.budget_score || 0} max={10} />
                  <ScoreBar label="Urgency" value={lead.urgency_score || 0} max={10} />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${action.color}`}>
                    {action.label}
                  </span>
                  {lead.conversion_probability != null && (
                    <span className="text-[11px] font-bold text-[#a5b4fc]">
                      {Math.round(lead.conversion_probability)}% close
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Lead Detail Panel */}
      {selectedLead && (
        <div className="w-full lg:w-[420px] shrink-0 border-l border-[#1F2937] bg-gradient-to-b from-[#0B0F19] to-[#000000] p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-white">Lead Intelligence</h2>
            <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-white text-sm lg:hidden">✕</button>
          </div>

          {/* Lead Header */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#6366F1]/20 flex items-center justify-center text-lg font-bold text-[#a5b4fc]">
                {(selectedLead.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-base font-bold text-white">{selectedLead.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{selectedLead.email || 'No email'}</p>
              </div>
            </div>
            {selectedLead.phone && <p className="text-xs text-gray-400">📞 {selectedLead.phone}</p>}
          </div>

          {/* Scores */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 mb-4 space-y-3">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Qualification Scores</h3>
            <ScoreRow label="Intent" value={selectedLead.intent_score} max={10} />
            <ScoreRow label="Budget" value={selectedLead.budget_score} max={10} />
            <ScoreRow label="Urgency" value={selectedLead.urgency_score} max={10} />
            <div className="pt-2 border-t border-[#1F2937] grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Close Probability</p>
                <p className="text-xl font-black text-[#a5b4fc]">{Math.round(selectedLead.conversion_probability || 0)}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Estimated Value</p>
                <p className="text-xl font-black text-emerald-400">${Math.round(selectedLead.lead_value_estimate || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {selectedLead.ai_summary && (
            <div className="bg-[#111827] border border-[#6366F1]/20 rounded-xl p-4 mb-4">
              <h3 className="text-[10px] font-bold text-[#a5b4fc] uppercase tracking-widest mb-2">AI Summary</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{selectedLead.ai_summary}</p>
            </div>
          )}

          {/* AI Explanation */}
          {selectedLead.ai_explanation && (
            <div className="bg-[#111827] border border-emerald-500/20 rounded-xl p-4 mb-4">
              <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Why This Lead Matters</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{selectedLead.ai_explanation}</p>
            </div>
          )}

          {/* Recommended Action */}
          {selectedLead.recommended_action && (
            <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 mb-4">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Recommended Action</h3>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                ACTION_LABELS[selectedLead.recommended_action]?.color || 'text-gray-400 bg-gray-400/10 border-gray-400/20'
              }`}>
                {ACTION_LABELS[selectedLead.recommended_action]?.label || selectedLead.recommended_action}
              </span>
            </div>
          )}

          {/* Behavioral Signals */}
          {selectedLead.behavioral_signals && typeof selectedLead.behavioral_signals === 'object' && (
            <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 mb-4">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Behavioral Signals</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedLead.behavioral_signals as Record<string, string>).map(([key, val]) => (
                  <div key={key} className="bg-[#0B0F19] border border-[#1F2937] rounded-lg px-3 py-2">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">{key}</p>
                    <p className={`text-xs font-bold mt-0.5 ${
                      val === 'high' || val === 'positive' ? 'text-emerald-400' : 
                      val === 'medium' || val === 'neutral' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Score bar mini component for lead cards */
function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#6b7280';
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[9px] text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-bold text-gray-400">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/* Score row for detail panel */
function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, ((value || 0) / max) * 100);
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#6b7280';
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-gray-400 font-medium">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{value || 0}/{max}</span>
      </div>
      <div className="h-2 bg-[#0B0F19] rounded-full overflow-hidden border border-[#1F2937]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
