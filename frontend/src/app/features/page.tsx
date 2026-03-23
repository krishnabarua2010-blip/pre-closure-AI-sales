"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const FEATURES = [
  { icon: '🔍', title: 'AI Lead Qualification', desc: 'Automatically score and qualify every lead before they reach your calendar.' },
  { icon: '📊', title: 'Revenue Probability Scoring', desc: 'Get precise revenue forecasts with every conversation.' },
  { icon: '⚡', title: 'Signal Detection', desc: 'Detect buying intent signals from prospect responses instantly.' },
  { icon: '🧠', title: 'Conversation Intelligence', desc: 'AI-powered insight on what drives your best prospects to convert.' },
  { icon: '📅', title: 'Call Booking Automation', desc: 'Hot leads automatically book a call — no manual follow-up.' },
  { icon: '📋', title: 'Lead Intelligence Summaries', desc: 'Get a full brief on each prospect before your call.' },
  { icon: '🎯', title: 'Sales Coaching', desc: 'Real-time coaching suggestions to close faster and smarter.' },
  { icon: '📄', title: 'Proposal Generator', desc: 'AI drafts winning proposals tailored to each lead\'s needs.' },
  { icon: '🤝', title: 'Client Onboarding AI', desc: 'Structured onboarding flows delivered by AI automatically.' },
  { icon: '🔄', title: 'Follow-up Automation', desc: 'Never let a warm lead go cold with smart follow-up sequences.' },
];

export default function FeaturesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-24 pb-32 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8b5cf6]/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div ref={containerRef} className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-12">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Home
          </Link>
          <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">Complete AI Tooling</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            Everything you need
            <br />
            <span className="text-gray-500">to scale sales</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our platform provides 100+ businesses with the AI infrastructure required to convert leads on autopilot.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-item glass p-8 rounded-2xl hover:border-[#6366F1]/40 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-[#1F2937] flex items-center justify-center text-2xl mb-6 shadow-xl group-hover:scale-110 group-hover:bg-[#6366F1]/10 group-hover:border-[#6366F1]/30 transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center feature-item">
          <div className="glass max-w-3xl mx-auto p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/10 to-[#8b5cf6]/10" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to automate your pipeline?</h2>
              <p className="text-gray-400 mb-8">Join the 100+ sales teams already using Pre-Closer AI.</p>
              <Link href="/signup" className="btn-glow inline-block bg-[#6366F1] hover:bg-[#5558e3] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-[#6366F1]/20">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
