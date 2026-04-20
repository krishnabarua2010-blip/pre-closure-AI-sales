"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function PipelinePage() {
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"idle" | "generating_leads" | "leads_ready" | "generating_messages" | "messages_ready" | "active">("idle");
  const [leads, setLeads] = useState<any[]>([]);
  const [outreaches, setOutreaches] = useState<any[]>([]);

  const handleGenerateLeads = async () => {
    if (!niche || !location) return;
    setStatus("generating_leads");
    try {
      const { data } = await api.post("/discovery/generate", { niche, location, count: 5 });
      setLeads(data.leads || []);
      setStatus("leads_ready");
    } catch (e) {
      console.error(e);
      setStatus("idle");
    }
  };

  const handleGenerateMessages = async () => {
    setStatus("generating_messages");
    try {
      // In our backend, the AI already generated outreach in a single pass to save cost/time.
      // We just call the endpoint to grab them and simulate the step.
      const { data } = await api.post("/discovery/outreach", { leadIds: leads.map(l => l.id) });
      
      // Simulate typing/generation delay for UX
      await new Promise(r => setTimeout(r, 1500));
      
      setOutreaches(data.outreaches || []);
      setStatus("messages_ready");
    } catch (e) {
      console.error(e);
      setStatus("leads_ready");
    }
  };

  const handleStartConversations = () => {
    setStatus("active");
  };

  return (
    <div className="flex w-full h-full bg-[#000000] text-white overflow-y-auto p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Auto Pipeline Engine <span className="px-2 py-0.5 rounded text-[10px] bg-[#6366F1]/20 text-[#a5b4fc] border border-[#6366F1]/30 uppercase">Beta</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Find, filter, warm, and close leads automatically. A complete sales department in a box.</p>
        </div>

        {/* Step 1: Lead Discovery */}
        <div className={`bg-[#0B0F19] border rounded-2xl p-6 transition-all ${status === "idle" ? "border-[#6366F1] shadow-lg shadow-[#6366F1]/10" : "border-[#1F2937] opacity-80"}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${status === "idle" ? "bg-[#6366F1] text-white" : "bg-[#1F2937] text-gray-400"}`}>1</div>
            <div>
              <h2 className="text-lg font-bold text-white">Find Ideal Leads</h2>
              <p className="text-[11px] text-gray-500">Enter your target criteria and let AI scrape and score the best prospects.</p>
            </div>
          </div>
          
          {(status === "idle" || status === "generating_leads") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Niche</label>
                <input 
                  type="text" 
                  disabled={status !== "idle"}
                  placeholder="e.g. Real Estate Agents" 
                  value={niche} 
                  onChange={e => setNiche(e.target.value)}
                  className="w-full bg-[#000000] border border-[#1F2937] rounded-xl px-4 py-3 text-sm focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Location</label>
                <input 
                  type="text" 
                  disabled={status !== "idle"}
                  placeholder="e.g. New York, NY" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-[#000000] border border-[#1F2937] rounded-xl px-4 py-3 text-sm focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <button 
                  onClick={handleGenerateLeads}
                  disabled={!niche || !location || status !== "idle"}
                  className="w-full bg-[#6366F1] hover:bg-[#5558e3] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {status === "generating_leads" ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mining Data...</>
                  ) : "Generate 50 Leads (Mock)"}
                </button>
              </div>
            </div>
          )}

          {status !== "idle" && status !== "generating_leads" && (
            <div className="bg-[#000000] border border-[#1F2937] rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-white">Targeting: {niche} in {location}</p>
                <p className="text-xs text-emerald-400 mt-0.5">✓ Found and analyzed {leads.length} high-intent prospects</p>
              </div>
              <button onClick={() => setStatus("idle")} className="text-xs text-gray-500 hover:text-white px-3 py-1">Reset</button>
            </div>
          )}
        </div>

        {/* Leads Display (Shown when leads are ready) */}
        {leads.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Scored Prospects</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {leads.map((lead: any, i) => (
                <div key={i} className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-lg shrink-0">
                    🏢
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-white truncate">{lead.name}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${lead.intent_score > 60 ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10'}`}>
                        {lead.intent_score} Score
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{lead.industry}</p>
                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 bg-[#0B0F19] p-2 rounded border border-[#1F2937]">"{lead.ai_summary}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Smart Outreach Generator */}
        {(status === "leads_ready" || status === "generating_messages" || status === "messages_ready" || status === "active") && (
          <div className={`bg-[#0B0F19] border rounded-2xl p-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 ${status === "leads_ready" ? "border-[#6366F1] shadow-lg shadow-[#6366F1]/10" : "border-[#1F2937] opacity-80"}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${status === "leads_ready" ? "bg-[#10b981] text-white" : "bg-[#1F2937] text-gray-400"}`}>2</div>
              <div>
                <h2 className="text-lg font-bold text-white">Generate Outreach</h2>
                <p className="text-[11px] text-gray-500">Create psychology-based personalized messaging for each lead.</p>
              </div>
            </div>

            {status === "leads_ready" && (
               <button 
                onClick={handleGenerateMessages}
                className="w-full bg-[#10b981] hover:bg-[#0ea5e9] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
              >
                Generate Personalized Messages
              </button>
            )}

            {status === "generating_messages" && (
              <div className="w-full py-8 flex flex-col items-center justify-center gap-3 text-[#10b981]">
                <span className="w-6 h-6 border-2 border-[#10b981]/30 border-t-[#10b981] rounded-full animate-spin" />
                <span className="text-sm font-semibold">Applying psychological hooks...</span>
              </div>
            )}

            {(status === "messages_ready" || status === "active") && (
              <div className="space-y-4">
                <div className="bg-[#000000] border border-[#1F2937] rounded-xl p-4 flex justify-between items-center">
                  <p className="text-sm font-semibold text-emerald-400">✓ {outreaches.length} messages generated</p>
                </div>
                
                {/* Carousel of messages */}
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {outreaches.map((outreach, i) => {
                    const lead = leads.find(l => l.id === outreach.lead_id);
                    return (
                      <div key={i} className="min-w-[300px] sm:min-w-[400px] w-full snap-center shrink-0 bg-[#111827] border border-[#1F2937] rounded-xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#10b981]/10 blur-xl rounded-full" />
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-xs font-bold text-gray-400">To: <span className="text-white">{lead?.name}</span></p>
                          <span className="text-[9px] bg-[#1F2937] px-2 py-0.5 rounded text-gray-400 uppercase tracking-widest">{outreach.platform}</span>
                        </div>
                        <div className="bg-[#0B0F19] rounded-lg p-3 border border-[#1F2937] relative">
                          <span className="absolute -top-2.5 right-3 px-1.5 py-0.5 text-[8px] bg-[#10b981] text-white font-bold rounded">AI HOOK</span>
                          <p className="text-xs text-emerald-400 italic mb-2">"{outreach.hook}"</p>
                          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{outreach.message}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Launch Campaigns */}
        {(status === "messages_ready" || status === "active") && (
          <div className={`bg-[#0B0F19] border rounded-2xl p-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 ${status === "messages_ready" ? "border-[#f59e0b] shadow-lg shadow-[#f59e0b]/10" : "border-[#1F2937]"}`}>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${status === "messages_ready" ? "bg-[#f59e0b] text-white" : "bg-[#f59e0b]/20 text-[#f59e0b]"}`}>3</div>
                <div>
                  <h2 className="text-lg font-bold text-white">Start Conversations</h2>
                  <p className="text-[11px] text-gray-500">Deploy your AI closer links and track replies.</p>
                </div>
              </div>
              
              {status === "messages_ready" ? (
                <button 
                  onClick={handleStartConversations}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-black py-3 px-6 rounded-xl shadow-lg transition-all animate-pulse hover:animate-none"
                >
                  Launch Campaign
                </button>
              ) : (
                <span className="text-sm font-bold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-4 py-2 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" /> Live
                </span>
              )}
            </div>

            {status === "active" && (
              <div className="bg-[#000000] border border-[#1F2937] rounded-xl p-5 text-center mt-4">
                <h3 className="text-lg font-bold text-white mb-2">Campaign is live! 🚀</h3>
                <p className="text-sm text-gray-400 mb-6">Your Pre-closer AI widget is now linked with this outreach. When leads reply, they drop right into your chat flow.</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#111827] p-4 rounded-xl border border-[#1F2937]">
                    <p className="text-2xl font-black text-white">{leads.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Deployed</p>
                  </div>
                  <div className="bg-[#111827] p-4 rounded-xl border border-[#1F2937]">
                    <p className="text-2xl font-black text-[#a5b4fc]">0</p>
                    <p className="text-[10px] text-gray-500 uppercase">Opened</p>
                  </div>
                  <div className="bg-[#111827] p-4 rounded-xl border border-[#1F2937]">
                    <p className="text-2xl font-black text-[#10b981]">0</p>
                    <p className="text-[10px] text-gray-500 uppercase">Chats Started</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
