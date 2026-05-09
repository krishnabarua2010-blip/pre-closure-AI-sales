"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

const FAKE_LEADS = [
  { name: 'Sarah Jenkins', company: 'TechFlow', status: 'New', score: 85, time: '2 mins ago' },
  { name: 'David Chen', company: 'Nexus Retail', status: 'Qualified', score: 92, time: '1 hr ago' },
  { name: 'Emma Watson', company: 'Bloom Health', status: 'Follow-up', score: 78, time: '3 hrs ago' },
  { name: 'Marcus Row', company: 'Global Logistics', status: 'Converted', score: 95, time: '1 day ago' },
];

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: '50%', y: '80%' });
  const [leads, setLeads] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({ total: 142, qualified: 48, winRate: 18, revenue: 42000 });
  const router = useRouter();

  // Animation sequence
  useEffect(() => {
    const sequence = async () => {
      // 1. Initial State
      setLeads([FAKE_LEADS[1], FAKE_LEADS[2], FAKE_LEADS[3]]);
      await delay(2000);

      // 2. Move cursor to "Import Leads"
      setCursorPos({ x: '85%', y: '15%' });
      await delay(1500);

      // 3. Click Import
      setCursorPos({ x: '85%', y: '16%' }); // Slight click depress
      addNotification('Importing leads from CRM...');
      await delay(500);
      setCursorPos({ x: '85%', y: '15%' });
      await delay(2000);

      // 4. New Lead Appears & AI Qualifies
      setLeads(FAKE_LEADS);
      setMetrics(m => ({ ...m, total: 143 }));
      addNotification('AI analyzing Sarah Jenkins...');
      setCursorPos({ x: '50%', y: '40%' });
      await delay(2500);
      addNotification('Lead Qualified: High Authority detected.');
      setMetrics(m => ({ ...m, qualified: 49 }));
      
      // 5. Follow-up triggered
      await delay(2000);
      setCursorPos({ x: '90%', y: '50%' });
      addNotification('Automated WhatsApp follow-up sent to Sarah.');
      
      // 6. Conversion
      await delay(3000);
      setMetrics(m => ({ ...m, winRate: 19, revenue: 45400 }));
      setLeads(current => {
        const updated = [...current];
        updated[0] = { ...updated[0], status: 'Converted', score: 98 };
        return updated;
      });
      addNotification('Deal Closed: $3,400 Revenue Added! 🎉');
      
      // 7. End Demo
      await delay(4000);
      setCursorPos({ x: '50%', y: '50%' });
      addNotification('Demo Complete.');
    };

    sequence();
  }, []);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const addNotification = (text: string) => {
    setNotifications(n => [...n, text]);
    setTimeout(() => {
      setNotifications(n => n.filter(msg => msg !== text));
    }, 4000);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden relative noise-bg">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Pipeline Overview</h1>
            <p className="text-gray-500 text-sm">Automated demo simulation running...</p>
          </div>
          <button className="bg-[#6366F1] hover:bg-[#5558e3] text-white px-4 py-2 rounded-lg font-medium transition-transform shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            Sync CRM
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="glass-premium rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Leads</p>
            <p className="text-3xl font-black text-white tabular-nums transition-all">{metrics.total}</p>
          </div>
          <div className="glass-premium rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Qualified</p>
            <p className="text-3xl font-black text-[#a5b4fc] tabular-nums transition-all">{metrics.qualified}</p>
          </div>
          <div className="glass-premium rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Win Rate</p>
            <p className="text-3xl font-black text-emerald-400 tabular-nums transition-all">{metrics.winRate}%</p>
          </div>
          <div className="glass-premium rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Expected Rev</p>
            <p className="text-3xl font-black text-yellow-400 tabular-nums transition-all">${metrics.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="glass-premium rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 font-semibold">Active Opportunities</div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#050505] text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">AI Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((l, i) => (
                <tr key={l.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center font-bold text-[#a5b4fc]">
                      {l.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{l.name}</div>
                      <div className="text-[10px] text-gray-500">{l.time}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-300">{l.company}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      l.status === 'Converted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      l.status === 'Qualified' ? 'bg-[#6366F1]/20 text-[#a5b4fc] border border-[#6366F1]/30' :
                      'bg-white/10 text-gray-300 border border-white/10'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-black text-lg text-emerald-400 tabular-nums">
                    {l.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications overlay */}
      <div className="absolute top-8 right-8 flex flex-col gap-3 z-50 pointer-events-none">
        {notifications.map((msg, i) => (
          <div key={i} className="glass-premium px-4 py-3 rounded-xl border border-[#6366F1]/30 shadow-[0_10px_40px_rgba(99,102,241,0.2)] flex items-center gap-3 animate-slideIn">
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium text-white">{msg}</span>
          </div>
        ))}
      </div>

      {/* Fake Cursor */}
      <div 
        className="absolute z-[100] pointer-events-none transition-all duration-[1500ms] ease-in-out"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-2xl">
          <path d="M4 4L11 20L14 14L20 11L4 4Z" fill="white" stroke="#000" strokeWidth="1"/>
        </svg>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
