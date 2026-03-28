"use client";

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatPrice } from '@/lib/currencyUtils';
import { handleUpgrade } from '@/lib/razorpay';

gsap.registerPlugin(ScrollTrigger);

const STARTER_FEATURES = [
  '500 AI messages / month',
  'AI lead qualification',
  'Lead dashboard',
  'Lead scoring',
  'Public AI assistant link',
  'Deal probability scoring',
  'Basic objection tracking',
];

const GROWTH_FEATURES = [
  'Unlimited AI messages',
  'AI revenue advisor',
  'Lead intelligence summaries',
  'Close strategy generator',
  'Proposal generator',
  'Client onboarding AI',
  'Call booking automation',
  'Follow-up automation',
  'Funnel analytics',
  'Sales coaching',
  'Deal probability engine',
  'Objection intelligence library',
  'Funnel leak detector',
  'Buyer intent timeline',
  'AI follow-up writer',
  'Conversation pattern learning',
];

const ACTIVITY_MESSAGES = [
  'Someone just captured a lead 2 mins ago',
  'A founder just automated their follow-ups',
  'An agency just upgraded to Growth plan',
  'Someone just booked a call via AI',
  'A website visitor just converted into a hot lead'
];

export default function PricingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [prices, setPrices] = useState({ starter: '$99', growth: '$199', starterOld: '$199', growthOld: '$399' });
  const [activityIdx, setActivityIdx] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    setPrices({
      starter: formatPrice(99),
      growth: formatPrice(199),
      starterOld: formatPrice(199),
      growthOld: formatPrice(399),
    });
  }, []);

  useEffect(() => {
    gsap.fromTo('[data-reveal]',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.8, ease: 'power2.out', stagger: 0.15,
        delay: 0.2,
      }
    );
  }, []);

  useEffect(() => {
    // Rotating activity toast logic
    const interval = setInterval(() => {
      setToastVisible(false);
      setTimeout(() => {
        setActivityIdx((prev) => (prev + 1) % ACTIVITY_MESSAGES.length);
        setToastVisible(true);
      }, 500); // Wait for fade out
    }, 8000); // Change message every 8 seconds
    
    // Initial show
    setTimeout(() => setToastVisible(true), 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
       handleUpgrade('growth', () => {
          window.location.href = '/onboarding';
       });
    } else {
       window.location.href = '/signup';
    }
  };

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
        <div className="max-w-5xl mx-auto relative z-10">

          {/* Header */}
          <div className="text-center mb-4" data-reveal>
            <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#a5b4fc] text-xs font-medium px-4 py-2 rounded-full mb-6">
              🚀 50% lifetime discount for the first 200 beta users
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">Turn your website visitors into qualified leads automatically</h1>
            <p className="text-gray-400 text-lg">Most businesses recover cost with 1–2 extra clients.</p>
          </div>

          {/* Free Preview */}
          <div className="mt-12 mb-8 bg-gradient-to-r from-[#6366F1]/10 to-[#8b5cf6]/10 border border-[#6366F1]/20 rounded-2xl p-6 text-center" data-reveal>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-2xl">🎁</span>
              <h3 className="text-lg font-bold text-white">Try All Features Free</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Experience the full Pre-Closer AI with 15 free messages. No credit card required.</p>
            <Link href="/signup" className="btn-glow inline-block bg-[#6366F1] hover:bg-[#5558e3] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#6366F1]/30">
              Start Your Free Preview →
            </Link>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Starter */}
            <div data-reveal className="feature-card bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-8">
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">Starter</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black text-white">{prices.starter}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600 line-through">{prices.starterOld}/month</span>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">50% beta off</span>
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

            {/* Growth */}
            <div data-reveal className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#6366F1] to-[#6366F1]/30" />
              <div className="relative bg-[#0a0a0a] rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Growth</p>
                  <span className="text-xs bg-[#6366F1] text-white px-2.5 py-1 rounded-full font-semibold shadow-lg shadow-[#6366F1]/30">⭐ Recommended</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black text-white">{prices.growth}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600 line-through">{prices.growthOld}/month</span>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">50% beta off</span>
                </div>
                <p className="text-sm text-gray-400 mt-4 mb-6">The complete AI sales floor. Unlimited AI-powered selling.</p>
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
                <button onClick={handlePricingClick} className="btn-glow w-full block text-center bg-[#6366F1] hover:bg-[#5558e3] text-white py-4 rounded-xl font-black transition-all shadow-xl shadow-[#6366F1]/40 hover:scale-[1.02]">
                  Get Growth Plan →
                </button>
                <div className="mt-5 space-y-1">
                  <p className="text-[10px] text-center text-[#f59e0b] font-bold tracking-wide mb-3">🔥 Early access pricing — this will increase as we add more features</p>
                  <p className="text-xs text-center text-emerald-400 font-semibold tracking-wide">✨ No setup needed — works instantly on your website</p>
                  <p className="text-[10px] text-center text-gray-500">You can test it live immediately after upgrade</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment methods + Guarantee */}
          <div data-reveal className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 bg-[#0a0a0a] border border-[#1F2937] rounded-2xl px-8 py-5 text-sm text-gray-400 flex-wrap justify-center">
              <div className="flex items-center gap-2"><span>💳</span> Cards</div>
              <div className="hidden md:block w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>🏦</span> UPI</div>
              <div className="hidden md:block w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>🔒</span> No contracts</div>
              <div className="hidden md:block w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>✨</span> 15 free messages</div>
              <div className="hidden md:block w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>💸</span> Cancel anytime</div>
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
