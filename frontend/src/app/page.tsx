"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '@/lib/api';
import CubeNetBackground from '@/components/CubeNetBackground';

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */
const FEATURES = [
  { icon: '🔍', title: 'AI Lead Qualification', desc: 'Automatically score and qualify every lead before they reach your calendar.' },
  { icon: '📊', title: 'Revenue Probability Scoring', desc: 'Get precise revenue forecasts with every conversation.' },
  { icon: '🚨', title: 'Objection Detection', desc: 'Identify objections in real-time and surface counter-arguments instantly.' },
  { icon: '📅', title: 'Call Booking Automation', desc: 'Hot leads automatically book a call — no manual follow-up.' },
  { icon: '🎯', title: 'Sales Coaching', desc: 'Real-time coaching suggestions to close faster and smarter.' },
  { icon: '📄', title: 'Proposal Generator', desc: 'AI drafts winning proposals tailored to each lead\'s needs.' },
  { icon: '🤝', title: 'Client Onboarding AI', desc: 'Structured onboarding flows delivered by AI automatically.' },
  { icon: '🔄', title: 'Follow-Up Automation', desc: 'Never let a warm lead go cold with smart follow-up sequences.' },
  { icon: '📈', title: 'Funnel Intelligence', desc: 'Full funnel visibility — know exactly where leads drop off.' },
];

const TESTIMONIALS = [
  { quote: "This AI replaced our entire lead qualification process. We went from 2-hour demos with bad fit clients to only speaking with serious buyers.", author: "Michael R.", role: "Agency Founder" },
  { quote: "We increased booked calls by 37% in just 3 weeks. Our sales team now only deals with hot leads.", author: "Sarah K.", role: "Growth Consultant" },
  { quote: "The AI qualifies, scores, and books calls while I sleep. It's essentially a full-time SDR for the price of a subscription.", author: "James T.", role: "B2B SaaS Founder" },
];

/* ─── Interactive Product Simulation ─── */
function ProductSimulation() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1200),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => { setStep(3); setScore(87); }, 5000),
      setTimeout(() => setStep(4), 7000),
      setTimeout(() => { setStep(0); setScore(0); }, 10000),
    ];
    const loop = setInterval(() => {
      setStep(0); setScore(0);
      setTimeout(() => setStep(1), 1200);
      setTimeout(() => setStep(2), 3000);
      setTimeout(() => { setStep(3); setScore(87); }, 5000);
      setTimeout(() => setStep(4), 7000);
    }, 10500);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  useEffect(() => {
    if (score === 0) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 3;
      if (current >= 87) { current = 87; clearInterval(interval); }
      setScore(current);
    }, 30);
    return () => clearInterval(interval);
  }, [step === 3]);

  return (
    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-gray-400 font-medium">AI Pre-Closer — Live Demo</span>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {step >= 1 && (
          <div className="sim-step flex justify-end">
            <div className="bg-[#6366F1] rounded-xl rounded-tr-sm px-4 py-2.5 text-sm text-white max-w-[85%]">
              Hi, I'm interested in scaling my agency to $50K MRR.
            </div>
          </div>
        )}

        {step >= 2 && (
          <div className="sim-step">
            <div className="flex justify-start">
              <div className="bg-[#1F2937] rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-300 max-w-[85%]">
                Great! What's your current monthly revenue and team size?
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5 ml-1">
              <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded font-semibold">⚡ Authority Signal Detected</span>
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="sim-step">
            <div className="flex justify-end">
              <div className="bg-[#6366F1] rounded-xl rounded-tr-sm px-4 py-2.5 text-sm text-white max-w-[85%]">
                $38K MRR, 4-person sales team. Growing 20% month over month.
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-1.5 mr-1">
              <span className="text-[11px] font-black text-[#6366F1]">Lead Score: {score} 🔥</span>
            </div>
          </div>
        )}

        {step >= 4 && (
          <div className="sim-step">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-green-400 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
              Strategy call booked — Tuesday 2:00 PM
            </div>
          </div>
        )}

        {step >= 1 && step < 4 && step % 2 === 1 && (
          <div className="flex justify-start items-center gap-2">
            <div className="bg-[#1F2937] rounded-xl rounded-tl-sm px-3 py-2 text-xs text-gray-300">
              <span className="inline-flex gap-1">
                <span className="typing-dot w-1 h-1 bg-[#6366F1] rounded-full inline-block" />
                <span className="typing-dot w-1 h-1 bg-[#6366F1] rounded-full inline-block" />
                <span className="typing-dot w-1 h-1 bg-[#6366F1] rounded-full inline-block" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api.get('/user/me')
      .then((res) => {
        const user = res.data;
        if (user.plan === 'BETA' || user.subscriptionStatus === 'ACTIVE') {
          router.push('/dashboard');
        }
      })
      .catch((err) => {
        localStorage.removeItem('token');
      });
  }, [router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroTextRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.reveal-stagger').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden relative z-[1]">
      {/* ── NAV ── */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#000000]/80 backdrop-blur-xl border-b border-[#1F2937]/60">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 12H2.5L9 2Z" fill="white"/>
              <circle cx="9" cy="13.5" r="2.5" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight">Pre-Closer AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <a href="#how" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Sign in</Link>
          <Link href="/signup" className="btn-glow text-sm bg-[#6366F1] hover:bg-[#5558e3] text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-[#6366F1]/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        <CubeNetBackground />

        {/* Glow balls */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8b5cf6]/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 max-w-7xl w-full mx-auto">
          {/* Text Side */}
          <div ref={heroTextRef} className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#a5b4fc] text-xs font-medium px-4 py-2 rounded-full mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 bg-[#6366F1] rounded-full animate-pulse" />
              Limited Beta Access for Selected Agencies
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.0] mb-6">
              <span className="gradient-text">Get qualified clients every week</span>
              <br />
              <span className="text-white">— without chasing leads</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-4 leading-relaxed">
              We find, contact, follow up, and qualify leads so you only talk to serious clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup" className="btn-glow bg-[#6366F1] hover:bg-[#5558e3] text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-[#6366F1]/30">
                Start Beta Access (₹1,500) →
              </Link>
              <a href="#demo" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white border border-[#1F2937] hover:border-[#374151] px-7 py-3.5 rounded-xl font-medium text-base transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                Watch Demo
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>Built for agencies scaling to 5–50 clients/month</span>
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex flex-col items-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#6366F1]/20 via-[#8b5cf6]/10 to-[#06b6d4]/15 rounded-full blur-[80px] opacity-60 pointer-events-none" />
            <div className="relative z-10 w-full max-w-md bg-[#0a0a0a] border border-[#1F2937] rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1F2937] bg-[#050505]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="flex-1 mx-4 bg-[#1F2937] rounded-lg px-3 py-1.5 text-xs text-gray-500 text-center">app.precloser.ai/leads</div>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { name: 'John D.', status: 'HOT 🔥', score: 92 },
                  { name: 'Sarah M.', status: 'WARM', score: 75 },
                  { name: 'Mike T.', status: 'MEETING BOOKED', score: 98 },
                ].map((l, i) => (
                  <div key={i} className="bg-[#111827] border border-[#1F2937] p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold text-white">{l.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{l.status}</div>
                    </div>
                    <div className="text-xl font-black text-emerald-400">{l.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO SECTION ── */}
      <section id="demo" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">Live Demo</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">See how your next client gets qualified automatically</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Watch exactly how Pre-Closer AI filters your leads and only sends you the serious ones.</p>
            <div className="mt-8">
               <Link href="/signup" className="btn-glow inline-block text-sm bg-[#1F2937] hover:bg-[#374151] text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
                  Try Demo with Your Niche →
               </Link>
            </div>
          </div>
          <div className="reveal">
            <ProductSimulation />
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center reveal">
          <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-6">The Problem</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 leading-tight">
            Stop wasting time on <span className="line-through text-gray-600">unqualified leads</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
            Most agencies lose 60% of leads due to slow follow-up. Imagine waking up to qualified clients already interested.
          </p>
        </div>
      </section>

      {/* ── WHAT YOU GET IN 30 DAYS ── */}
      <section id="how" className="py-32 px-6 bg-[#000000] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal">
            <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">Set it once. Let it run.</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">What you get in 30 days</h2>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-8 max-w-2xl mx-auto reveal-stagger">
            <ul className="space-y-6">
              {[
                '100 targeted leads generated',
                'AI filters out the tire-kickers and serious prospects',
                'Personalized outreach sent to every lead',
                'Follow-ups handled automatically (3-4 steps)',
                'You receive ONLY interested, ready-to-buy clients',
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 text-lg text-gray-300 font-medium">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ── */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">Product Preview</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">See what's waiting inside</h2>
          </div>
          <div className="reveal bg-[#0a0a0a] border border-[#1F2937] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1F2937] bg-[#050505]">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="flex-1 mx-4 bg-[#1F2937] rounded-lg px-3 py-1.5 text-xs text-gray-500">app.precloser.ai/dashboard</div>
            </div>
            <div className="flex h-[400px]">
              <div className="w-48 border-r border-[#1F2937] p-4 space-y-1">
                {['Dashboard','Leads','Advisor','Proposals','Onboarding','Settings'].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${i === 0 ? 'bg-[#6366F1]/15 text-[#a5b4fc]' : 'text-gray-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#6366F1]' : 'bg-[#374151]'}`} />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-5">
                <p className="text-sm font-bold text-white mb-4">Sales Overview</p>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[{ label:'Total Leads', val:'284' },{ label:'Qualified', val:'67' },{ label:'Win Rate', val:'34%' },{ label:'Rev Score', val:'8.2' }].map((m, i) => (
                    <div key={i} className="bg-[#050505] border border-[#1F2937] rounded-xl p-3">
                      <div className="text-[10px] text-gray-500 mb-1">{m.label}</div>
                      <div className="text-xl font-black text-white">{m.val}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#050505] border border-[#1F2937] rounded-xl p-4">
                    <p className="text-[10px] text-gray-500 mb-3">Pipeline Activity</p>
                    <div className="flex items-end gap-1 h-16">
                      {[40,65,50,80,60,90,75,55,85,70,95,88].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `rgba(99,102,241,${0.3 + (i % 3) * 0.2})` }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#050505] border border-[#1F2937] rounded-xl p-4">
                    <p className="text-[10px] text-gray-500 mb-2">🧠 AI Advisor</p>
                    <p className="text-[10px] text-gray-300 leading-relaxed">Win rate dropped 12% this week. Possible cause: High volume of low-authority leads.</p>
                    <p className="text-[10px] text-[#6366F1] mt-1.5 font-semibold">→ Adjust qualification questions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32 px-6 bg-[#000000]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Everything you need to close</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">A complete AI sales stack — from first touch to signed contract.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="reveal-stagger feature-card bg-[#0a0a0a] border border-[#1F2937] hover:border-[#6366F1]/30 rounded-2xl p-5 group cursor-default">
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Trusted by growth teams</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="reveal-stagger feature-card bg-[#0a0a0a] border border-[#1F2937] hover:border-[#6366F1]/20 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_,j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <blockquote className="text-sm text-gray-300 leading-relaxed mb-5">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.author}</div>
                    <div className="text-[10px] text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-32 px-6 bg-[#000000] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Simple pricing. Massive ROI.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Beta Access */}
            <div className="reveal-stagger feature-card bg-[#111827] border-2 border-[#6366F1] rounded-2xl p-8 relative transform md:scale-105 z-10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6366F1] text-white px-4 py-1 rounded-full text-xs font-black tracking-wide uppercase">
                🔥 BETA ACCESS
              </div>
              <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4 text-center">Limited to early agencies</p>
              <div className="flex items-baseline justify-center gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹1,500</span>
                <span className="text-gray-500 text-sm">/ 30 days</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Up to 100 targeted leads', 'AI lead qualification (HOT/WARM/COLD)', 'AI-generated personalized outreach', 'Automated follow-ups (3-4 steps)', 'AI chat that talks to your leads', 'Lead scoring based on intent', 'Basic analytics dashboard', 'Setup assistance'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="bg-[#050505] p-3 rounded-xl mb-8 border border-[#1F2937]">
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Limits</p>
                <p className="text-xs text-gray-500">⚡ 10 leads/day<br/>⚡ 5 AI conversations/day<br/>⚡ 5 message generations/day</p>
                <p className="text-xs text-emerald-400 mt-2 font-medium">Bonus: ₹1,500 credited back if you upgrade.</p>
              </div>
              <Link href="/signup" className="btn-glow block text-center bg-[#6366F1] hover:bg-[#5558e3] text-white py-3 rounded-xl font-bold transition-all text-sm shadow-lg shadow-[#6366F1]/30">
                Start Beta Access
              </Link>
            </div>

            {/* Starter */}
            <div className="reveal-stagger feature-card bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-8 mt-4 mb-4">
              <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">Starter</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹9,999</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['300 leads/month', 'Full automation', 'AI chat qualification', 'Follow-ups', 'Basic analytics'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <svg className="w-5 h-5 text-[#6366F1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-[#374151] hover:border-[#6366F1] text-white py-3 rounded-xl font-semibold transition-all text-sm mt-auto">
                Select Starter
              </Link>
            </div>

            {/* Growth */}
            <div className="reveal-stagger feature-card bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-8 mt-4 mb-4 relative">
              <div className="absolute top-0 right-0 bg-[#374151] text-white px-3 py-1 rounded-bl-lg rounded-tr-xl text-[10px] font-bold uppercase">
                Most Popular
              </div>
              <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">Growth</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹17,999</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['800+ leads/month', 'Advanced AI qualification', 'Smart follow-up sequences', 'Priority processing', 'Full analytics dashboard', 'Advisor + analysis system'].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <svg className="w-5 h-5 text-[#6366F1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center bg-[#1F2937] hover:bg-[#374151] text-white py-3 rounded-xl font-semibold transition-all text-sm mt-auto">
                Select Growth
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10 reveal">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Stop wasting time on
            <br />
            <span className="gradient-text">unqualified leads.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Let AI filter the serious buyers. You focus on closing.
          </p>
          <Link href="/signup" className="btn-glow inline-block bg-[#6366F1] hover:bg-[#5558e3] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl shadow-[#6366F1]/30">
            Start Beta Access (₹1,500) →
          </Link>
          <p className="text-gray-600 text-xs mt-4">Beta pricing locked in forever.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1F2937] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#6366F1] flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15.5 12H2.5L9 2Z" fill="white"/>
                <circle cx="9" cy="13.5" r="2.5" fill="white" fillOpacity="0.6"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Pre-Closer AI</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-gray-400 transition-colors">Login</Link>
          </div>
          <p className="text-xs text-gray-600">© 2025 Pre-Closer AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
