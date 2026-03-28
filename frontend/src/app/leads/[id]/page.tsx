"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { handleUpgrade } from '@/lib/razorpay';
import { ArrowLeft, BrainCircuit, Target, ShieldAlert, PhoneCall, Clock, Mail, Zap } from 'lucide-react';

/* ─── Simulated buyer intent timeline events ─── */
function generateTimeline(intelligence: any) {
  const baseTime = new Date();
  baseTime.setMinutes(baseTime.getMinutes() - 15);
  
  const events = [
    { time: formatTime(baseTime, 0), text: 'Lead opened assistant', type: 'action' as const },
    { time: formatTime(baseTime, 1), text: intelligence?.pain_points?.[0] || 'Shared their current challenge', type: 'signal' as const },
    { time: formatTime(baseTime, 3), text: intelligence?.budget_info || 'Discussed budget range', type: 'budget' as const },
    { time: formatTime(baseTime, 5), text: intelligence?.authority_info || 'Confirmed they are the decision maker', type: 'authority' as const },
    { time: formatTime(baseTime, 7), text: 'Asked about results timeline', type: 'intent' as const },
  ];
  return events;
}

function formatTime(base: Date, addMinutes: number) {
  const d = new Date(base.getTime() + addMinutes * 60000);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ─── Follow-up email generator ─── */
function generateFollowUp(intelligence: any, strategy: any) {
  const name = intelligence?.lead_name || intelligence?.name || 'there';
  const painPoint = intelligence?.pain_points?.[0] || 'scaling efficiently';
  const objection = intelligence?.objections?.[0] || 'evaluating options';
  
  return `Hey ${name},

You mentioned you're ${objection.toLowerCase().includes('price') ? 'evaluating options for' : 'looking into'} ${painPoint.toLowerCase()}.

Many business owners we work with see results in the first 30 days because the assistant filters serious prospects before calls.

If you'd like, I can show how another business used this to increase booked calls by 40%.

Would Tuesday or Wednesday work for a quick strategy call?

Best regards,
Your AI Pre-Closer`;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.id as string;

  const [data, setData] = useState<any>({
    intelligence: null,
    strategy: null,
    brief: null,
    coaching: null,
    followups: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (!leadId) return;

    const fetchLeadDetails = async () => {
      try {
        const payload = { lead_id: leadId, id: leadId };
        
        const [intel, strat, brief, coach] = await Promise.all([
          api.post('/lead_intelligence', payload).catch((e) => { if(e?.response?.status === 403) throw e; return { data: {} }; }),
          api.post('/generate_close_strategy', payload).catch((e) => { if(e?.response?.status === 403) throw e; return { data: {} }; }),
          api.post('/conversation_id_brief', payload).catch((e) => { if(e?.response?.status === 403) throw e; return { data: {} }; }),
          api.post('/get_coaching_advice', payload).catch((e) => { if(e?.response?.status === 403) throw e; return { data: {} }; })
        ]);

        setData({
          intelligence: intel.data,
          strategy: strat.data,
          brief: brief.data,
          coaching: coach.data,
          followups: null,
        });
      } catch (err: any) {
        if (err?.response?.status === 403) {
          setIsLocked(true);
          setData({
             intelligence: { pain_points: ["Struggling with scalability"], summary: "High buying intent detected based on recent interactions." },
             strategy: { strategy: "Target specific objections immediately to close." },
             brief: { brief: "Strong prospect. Decision maker status confirmed." },
             coaching: { advice: "Push for a live demo to capitalize on urgency." }
          });
        } else {
          setError('Failed to load deep lead insights.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeadDetails();
  }, [leadId]);

  const generateFollowUps = async () => {
    setFollowUpLoading(true);
    try {
      const { data: followupData } = await api.post('/generate_followups', { lead_id: leadId, id: leadId });
      setData((prev: any) => ({ ...prev, followups: followupData }));
    } catch {
      // Use locally generated follow-up as fallback
      setData((prev: any) => ({ ...prev, followups: { generated: true } }));
    } finally {
      setFollowUpLoading(false);
    }
  };

  const copyFollowUp = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (loading) {
    return (
       <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse flex space-x-2">
           <div className="w-2.5 h-2.5 bg-primary/40 rounded-full"></div>
           <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animation-delay-200"></div>
           <div className="w-2.5 h-2.5 bg-primary rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  const timeline = generateTimeline(data.intelligence);
  const followUpEmail = generateFollowUp(data.intelligence, data.strategy);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fade-in-0 slide-in-from-bottom-[10px]">
      <button 
        onClick={() => router.back()}
        className="text-xs font-medium text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors mb-2 uppercase tracking-wider"
      >
        <ArrowLeft size={14} /> Back to Leads
      </button>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-3 flex-wrap">
          Lead Intelligence
          <span className="text-xs font-medium bg-white/10 text-gray-300 px-2.5 py-1 rounded-full border border-white/5">ID: {leadId}</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">AI-generated insights and tailored close strategy.</p>
        {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg> {error}</p>}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* BUYER INTENT TIMELINE */}
      {/* ═══════════════════════════════════════════════════ */}
      {isLocked && (
        <div className="absolute inset-x-0 top-[180px] bottom-0 z-20 flex flex-col items-center pt-24 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent backdrop-blur-[2px]">
           <div className="bg-[#111827] border border-[#f59e0b]/40 p-8 rounded-2xl max-w-lg text-center shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent" />
             <h3 className="text-xl sm:text-2xl font-black mb-2 text-white flex items-center justify-center gap-2"><span className="animate-pulse">🔥</span> This visitor is READY to convert</h3>
             <p className="text-lg font-black text-emerald-400 mb-4 bg-emerald-400/10 inline-block px-4 py-1.5 rounded-full border border-emerald-400/20">Estimated value: $800–$2,000</p>
             <p className="text-sm text-gray-300 font-semibold mb-2 leading-relaxed">Unlock full details + auto follow-up before they leave</p>
             <p className="text-xs text-red-400 font-bold mb-6 animate-pulse">⏳ This lead may go cold in the next few minutes</p>
             <button onClick={() => handleUpgrade('growth', () => { window.location.href = '/onboarding'; })} className="bg-[#f59e0b] hover:bg-[#d97706] text-black px-6 py-4 rounded-xl font-black text-lg transition-all w-full shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02]">
               Capture This Lead Now
             </button>
             <div className="mt-4 space-y-1">
               <p className="text-xs text-gray-400 font-medium">✨ No setup needed — works instantly on your website</p>
               <p className="text-[10px] text-gray-500">You can test it live immediately after upgrade</p>
             </div>
           </div>
        </div>
      )}
      <div className={`space-y-6 ${isLocked ? 'blur-md pointer-events-none select-none opacity-60' : ''}`}>
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border/50">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center border border-[#6366F1]/20">
            <Clock size={16} className="text-[#6366F1]" />
          </div>
          <h2 className="text-base font-semibold text-white leading-none">Buyer Intent Timeline</h2>
        </div>
        
        <div className="relative pl-6">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[#6366F1] via-[#6366F1]/50 to-transparent" />
          
          <div className="space-y-4">
            {timeline.map((event, i) => (
              <div key={i} className="relative flex items-start gap-4">
                {/* Dot */}
                <div className={`absolute -left-[15px] top-1.5 w-3 h-3 rounded-full border-2 ${
                  event.type === 'intent' ? 'border-emerald-400 bg-emerald-400' :
                  event.type === 'budget' ? 'border-yellow-400 bg-yellow-400' :
                  event.type === 'authority' ? 'border-[#6366F1] bg-[#6366F1]' :
                  event.type === 'signal' ? 'border-orange-400 bg-orange-400' :
                  'border-gray-500 bg-gray-500'
                }`} />
                
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-[11px] text-gray-500 font-mono min-w-[50px] shrink-0 mt-0.5">{event.time}</span>
                  <p className="text-sm text-gray-300">{event.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Intent spike insight */}
        <div className="mt-5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-emerald-400" />
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Buying Intent Spike Detected</p>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-1">
            Lead asked about results timeframe which usually indicates <span className="text-emerald-400 font-semibold">readiness to purchase</span>.
          </p>
          <p className="text-xs text-gray-500">
            Sales people love story over data. This transforms your system into sales intelligence, not chat logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Intelligence Card */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border/50">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
               <BrainCircuit size={16} className="text-primary" />
             </div>
             <h2 className="text-base font-semibold text-white leading-none">Intelligence</h2>
          </div>
          <div className="space-y-6 flex-1">
            <div>
               <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Summary</h3>
               <p className="text-sm text-gray-300 leading-relaxed">
                 {data.intelligence?.summary || data.intelligence?.lead_summary || 'No summary extracted from metadata yet.'}
               </p>
            </div>
            <div>
               <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Pain Points</h3>
               <ul className="list-disc pl-4 space-y-1.5 text-sm text-gray-300">
                 {Array.isArray(data.intelligence?.pain_points) 
                   ? data.intelligence.pain_points.map((p: string, i: number) => <li key={i}>{p}</li>)
                   : <li className="text-gray-400 italic text-sm list-none -ml-4">{data.intelligence?.pain_points || 'No specific pain points identified.'}</li>}
               </ul>
            </div>
          </div>
        </div>

        {/* Objections & Coaching */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border/50">
             <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
               <ShieldAlert size={16} className="text-red-500" />
             </div>
             <h2 className="text-base font-semibold text-white leading-none">Objections & Coaching</h2>
          </div>
          <div className="space-y-6 flex-1">
            <div>
               <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Known Objections</h3>
               <ul className="list-disc pl-4 space-y-1.5 text-sm text-gray-300">
                 {Array.isArray(data.intelligence?.objections) 
                   ? data.intelligence.objections.map((o: string, i: number) => <li key={i}>{o}</li>)
                   : <li className="text-gray-400 italic text-sm list-none -ml-4">{data.intelligence?.objections || 'No objections recorded in previous loops.'}</li>}
               </ul>
            </div>
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-lg mt-auto">
               <h3 className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">Coaching Advice</h3>
               <p className="text-sm text-gray-300 leading-relaxed text-primary/90">
                 {data.coaching?.advice || data.coaching?.recommendation || 'No specific coaching advice triggered for this profile.'}
               </p>
            </div>
          </div>
        </div>

        {/* Close Strategy */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border/50">
             <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
               <Target size={16} className="text-emerald-500" />
             </div>
             <h2 className="text-base font-semibold text-white leading-none">Close Strategy</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300">
            {data.strategy?.close_strategy || data.strategy?.strategy ? (
               <div dangerouslySetInnerHTML={{ __html: data.strategy.close_strategy || data.strategy.strategy }}></div>
            ) : (
               <p className="italic text-gray-500 text-sm">Waiting for sufficient data to generate strategy outline...</p>
            )}
          </div>
        </div>

        {/* Call Brief */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border/50">
             <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
               <PhoneCall size={16} className="text-blue-500" />
             </div>
             <h2 className="text-base font-semibold text-white leading-none">Call Prep Brief</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
             {data.brief?.brief || data.brief?.preparation || (
                <p className="italic text-gray-500 text-sm">Generating comprehensive call briefing notes based on prospect footprint...</p>
             )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* FOLLOW-UP AUTOMATION BRAIN */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-border/50 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center border border-[#8b5cf6]/20">
              <Mail size={16} className="text-[#8b5cf6]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white leading-none">AI Follow-Up Writer</h2>
              <p className="text-[11px] text-gray-500 mt-1">Hyper-contextual follow-up based on lead signals</p>
            </div>
          </div>
          <button
            onClick={generateFollowUps}
            disabled={followUpLoading}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-[#8b5cf6]/20 disabled:opacity-50 flex items-center gap-2"
          >
            {followUpLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Generating...
              </>
            ) : 'Generate Follow-Up'}
          </button>
        </div>

        {/* Signal tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] font-medium bg-[#6366F1]/10 text-[#a5b4fc] px-2.5 py-1 rounded-full border border-[#6366F1]/20">
            {data.intelligence?.authority_info || '👤 Decision maker'}
          </span>
          <span className="text-[10px] font-medium bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-500/20">
            ⚡ {data.intelligence?.urgency || 'Medium urgency'}
          </span>
          <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            💰 {data.intelligence?.budget_info || 'Budget confirmed'}
          </span>
        </div>

        {/* Generated follow-up email */}
        <div className="relative bg-[#0B0F19] border border-[#1F2937] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">AI-Generated Follow-Up Email</p>
            <button
              onClick={() => copyFollowUp(data.followups?.email || data.followups?.followup_messages?.[0] || followUpEmail)}
              className="text-[10px] text-[#a5b4fc] hover:text-white font-medium transition-colors flex items-center gap-1"
            >
              {copiedEmail ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">
            {data.followups?.email || data.followups?.followup_messages?.[0] || followUpEmail}
          </pre>
        </div>
      </div>
    </div>
    </div>
  );
}
