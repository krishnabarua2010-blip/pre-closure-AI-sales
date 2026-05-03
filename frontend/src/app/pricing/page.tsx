"use client";

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BETA_FEATURES = [
  '14-day full access',
  '80 leads',
  '40 AI enrichments',
  '40 outreach messages',
  '20 AI chats',
  '₹1,500 credited on upgrade',
];

const STARTER_FEATURES = [
  '200 leads / month',
  '100 AI enrichments',
  '200 outreach messages',
  '50 AI chats',
  'AI chat closer',
  'Basic lead scoring',
  'Follow-up automation (2-step)',
  'Lead dashboard',
];

const GROWTH_FEATURES = [
  '1,000 leads / month',
  '500 AI enrichments',
  '2,000 outreach messages',
  '500 AI chats',
  'Full AI lead intelligence',
  'Personalized outreach generator',
  'CRM pipeline dashboard',
  '🔥 Hot lead alerts',
  '4-step follow-up automation',
  'AI chat qualification',
  'Priority processing',
  'Close strategy generator',
  'Deal probability engine',
];

const COMPARISON_DATA = [
  { feature: 'Leads / month', beta: '80 (14 days)', starter: '200', growth: '1,000' },
  { feature: 'AI enrichments', beta: '40', starter: '100', growth: '500' },
  { feature: 'Outreach messages', beta: '40', starter: '200', growth: '2,000' },
  { feature: 'AI chat sessions', beta: '20', starter: '50', growth: '500' },
  { feature: 'Lead scoring', beta: '✅ Basic', starter: '✅ Basic', growth: '✅ 5-dimension' },
  { feature: 'Follow-up automation', beta: '❌', starter: '✅ 2-step', growth: '✅ 4-step' },
  { feature: 'Hot lead alerts', beta: '❌', starter: '❌', growth: '✅' },
  { feature: 'CRM pipeline', beta: '❌', starter: 'Basic', growth: '✅ Full' },
  { feature: 'AI qualification', beta: '✅', starter: '✅', growth: '✅ Advanced' },
  { feature: 'Priority processing', beta: '❌', starter: '❌', growth: '✅' },
  { feature: 'Cooldown between actions', beta: '15 sec', starter: '15 sec', growth: '3 sec' },
];

const ACTIVITY_MESSAGES = [
  '🔥 A founder just discovered 12 hot leads in Mumbai',
  '💰 Someone just converted a lead worth ₹2,50,000',
  '🚀 An agency just automated 30 follow-ups',
  '📈 A business just upgraded to Growth plan',
  '✅ A website visitor just became a qualified lead',
  '🎯 A consultant found 8 perfect-match clients',
];

export default function PricingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activityIdx, setActivityIdx] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    gsap.fromTo('[data-reveal]',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15, delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setToastVisible(false);
      setTimeout(() => {
        setActivityIdx((prev) => (prev + 1) % ACTIVITY_MESSAGES.length);
        setToastVisible(true);
      }, 500);
    }, 8000);
    setTimeout(() => setToastVisible(true), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#000000] text-white overflow-x-hidden relative z-[1]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#000000]/80 backdrop-blur-xl border-b border-[#1F2937]/60">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 12H2.5L9 2Z" fill="white"/>
              <circle cx="9" cy="13.5" r="2.5" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight text-sm">Pre-Closer AI</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
      </nav>

      <div className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">

          {/* Header */}
          <div className="text-center mb-4" data-reveal>
            <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#a5b4fc] text-xs font-medium px-4 py-2 rounded-full mb-6">
              🚀 Limited spots — Early access pricing
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Get clients automatically.<br />
              <span className="text-[#6366F1]">Only talk to serious leads.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stop wasting time chasing cold leads. Pre-Closer AI finds, scores, and qualifies your ideal clients — so you only talk to people ready to buy.
            </p>
          </div>

          {/* Value Anchor */}
          <div className="mt-8 mb-12 text-center" data-reveal>
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-6 py-3">
              <span className="text-2xl">💡</span>
              <p className="text-sm text-emerald-400 font-semibold">
                Just 1 client pays for the entire system. Most users close 3–5 new clients in their first month.
              </p>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">

            {/* Beta Access */}
            <div data-reveal className="feature-card bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Beta Access</p>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">Try First</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">₹1,500</span>
                  <span className="text-gray-500 text-sm">one-time</span>
                </div>
                <p className="text-xs text-emerald-400 mt-1 font-medium">
                  ✨ Credited fully on upgrade to any plan
                </p>
              </div>
              <p className="text-sm text-gray-400 mb-6">Try the full system for 14 days. Zero risk — your ₹1,500 becomes credit if you upgrade.</p>
              <ul className="space-y-3 mb-8">
                {BETA_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-[#374151] hover:border-amber-500/50 hover:bg-amber-500/5 text-white py-3.5 rounded-xl font-semibold transition-all text-sm">
                Start Beta Access →
              </Link>
            </div>

            {/* Starter */}
            <div data-reveal className="feature-card bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-8">
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">Starter</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">₹9,999</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600 line-through">₹14,999/month</span>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">Save 33%</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6">Perfect for solo founders qualifying leads on autopilot.</p>
              <ul className="space-y-3 mb-8">
                {STARTER_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-[#6366F1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-[#374151] hover:border-[#6366F1]/50 hover:bg-[#6366F1]/5 text-white py-3.5 rounded-xl font-semibold transition-all text-sm">
                Get Started with Starter
              </Link>
            </div>

            {/* Growth — HIGHLIGHTED */}
            <div data-reveal className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#6366F1] to-[#6366F1]/30" />
              <div className="relative bg-[#0a0a0a] rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Growth</p>
                  <span className="text-xs bg-[#ef4444] text-white px-2.5 py-1 rounded-full font-semibold shadow-lg shadow-[#ef4444]/30 animate-pulse">⭐ Most Popular</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">₹17,999</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600 line-through">₹29,999/month</span>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">Save 40%</span>
                </div>
                <p className="text-sm text-[#a5b4fc] mt-4 mb-2 font-medium">
                  The complete AI sales floor. Full automation. Maximum clients.
                </p>
                <p className="text-sm text-gray-400 mb-6">For businesses serious about automated client acquisition.</p>
                <ul className="space-y-3 mb-8">
                  {GROWTH_FEATURES.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-[#6366F1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="btn-glow w-full block text-center bg-[#6366F1] hover:bg-[#5558e3] text-white py-4 rounded-xl font-black transition-all shadow-xl shadow-[#6366F1]/40 hover:scale-[1.02]">
                  Get Growth Plan →
                </Link>
                <div className="mt-5 space-y-1">
                  <p className="text-[10px] text-center text-[#f59e0b] font-bold tracking-wide mb-3">🔥 Early access pricing — increases as we grow</p>
                  <p className="text-xs text-center text-emerald-400 font-semibold tracking-wide">✨ Works instantly — no setup needed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table Toggle */}
          <div className="mt-16 text-center" data-reveal>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-sm text-[#a5b4fc] hover:text-white transition-colors font-semibold border border-[#6366F1]/30 hover:border-[#6366F1]/60 px-6 py-3 rounded-xl"
            >
              {showComparison ? 'Hide' : 'Show'} Feature Comparison ↓
            </button>
          </div>

          {/* Comparison Table */}
          {showComparison && (
            <div className="mt-8 overflow-x-auto" data-reveal>
              <table className="w-full text-sm border border-[#1F2937] rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-[#111827]">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Feature</th>
                    <th className="text-center px-4 py-3 text-amber-400 font-medium">Beta (₹1,500)</th>
                    <th className="text-center px-4 py-3 text-gray-300 font-medium">Starter (₹9,999)</th>
                    <th className="text-center px-4 py-3 text-[#6366F1] font-bold">Growth (₹17,999)</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_DATA.map((row, i) => (
                    <tr key={i} className={`border-t border-[#1F2937] ${i % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#080808]'}`}>
                      <td className="px-4 py-3 text-gray-300 font-medium">{row.feature}</td>
                      <td className="px-4 py-3 text-center text-gray-400">{row.beta}</td>
                      <td className="px-4 py-3 text-center text-gray-300">{row.starter}</td>
                      <td className="px-4 py-3 text-center text-[#a5b4fc] font-semibold">{row.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Trust Signals */}
          <div data-reveal className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 bg-[#0a0a0a] border border-[#1F2937] rounded-2xl px-8 py-5 text-sm text-gray-400 flex-wrap justify-center">
              <div className="flex items-center gap-2"><span>💳</span> Cards & UPI</div>
              <div className="hidden md:block w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>🔒</span> No contracts</div>
              <div className="hidden md:block w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>💸</span> Cancel anytime</div>
              <div className="hidden md:block w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>✨</span> Beta credit on upgrade</div>
            </div>
          </div>

        </div>
      </div>

      {/* Live Activity Toast */}
      <div
        className={`fixed bottom-6 left-6 z-50 bg-[#111827] border border-[#1F2937] shadow-2xl rounded-xl p-3 flex items-center gap-3 transition-all duration-500 transform ${
          toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
        <span className="text-xs font-medium text-gray-300 pr-2">{ACTIVITY_MESSAGES[activityIdx]}</span>
      </div>
    </div>
  );
}
