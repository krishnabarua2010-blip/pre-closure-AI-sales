"use client";

import { useState } from 'react';

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://precloser.com/?ref=AGENCYX";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Partner Program</h1>
            <p className="text-gray-500 mt-1 text-sm">Earn 30% recurring commission for every agency you refer.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-2 rounded-lg font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Active Partner
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Total Earnings</p>
            <p className="text-3xl font-black text-emerald-400">$2,450</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Pending Payout</p>
            <p className="text-3xl font-black text-white">$450</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Active Referrals</p>
            <p className="text-3xl font-black text-indigo-400">12</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Conversion Rate</p>
            <p className="text-3xl font-black text-white">8.5%</p>
          </div>
        </div>

        {/* Link & Invite */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-lg font-bold text-white mb-2">Your Referral Link</h2>
          <p className="text-sm text-gray-400 mb-6">Share this link with other agencies. They get 10% off their first month, and you get 30% recurring commission.</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-[#050505] border border-white/[0.1] rounded-xl flex items-center p-2 pl-4">
              <span className="text-gray-400 text-sm truncate flex-1">{referralLink}</span>
              <button 
                onClick={handleCopy}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ml-2"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all shrink-0">
              Share on X (Twitter)
            </button>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Active Referrals Table */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">Recent Referrals</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#050505] text-gray-600 text-[10px] uppercase tracking-widest border-b border-white/[0.06]">
                    <th className="px-5 py-3 font-semibold">Agency</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: "Digital Nexus", plan: "Growth", status: "Active", comm: "$89.97/mo" },
                    { name: "Elevate Media", plan: "Scale", status: "Active", comm: "$29.70/mo" },
                    { name: "Spark SEO", plan: "Growth", status: "Trial", comm: "Pending" },
                    { name: "Creative Block", plan: "Growth", status: "Active", comm: "$89.97/mo" },
                  ].map((ref, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-gray-200">{ref.name}</div>
                        <div className="text-[11px] text-gray-500">{ref.plan} Plan</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wide
                          ${ref.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-sm text-gray-300">
                        {ref.comm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout History */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">Payout History</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { date: "May 1, 2026", amount: "$350.00", status: "Paid" },
                { date: "Apr 1, 2026", amount: "$285.50", status: "Paid" },
                { date: "Mar 1, 2026", amount: "$150.00", status: "Paid" },
              ].map((payout, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#050505] border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-200">{payout.amount}</div>
                      <div className="text-[11px] text-gray-500">{payout.date}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">{payout.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
