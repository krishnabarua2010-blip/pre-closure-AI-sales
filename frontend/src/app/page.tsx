"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import CubeNetBackground from '@/components/CubeNetBackground';

gsap.registerPlugin(ScrollTrigger);

const LiquidMetalBall = dynamic(() => import('@/components/LiquidMetalBall'), { ssr: false });

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
              Hi, I&apos;m interested in scaling my agency to $50K MRR.
            </div>
          </div>
        )}

        {step >= 2 && (
          <div className="sim-step">
            <div className="flex justify-start">
              <div className="bg-[#1F2937] rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-300 max-w-[85%]">
                Great! What&apos;s your current monthly revenue and team size?
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

/* ─── Particle Background ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.3,
        o: Math.random() * 0.3 + 0.08,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.o})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

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
              50% Lifetime Discount — First 200 Beta Users
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.0] mb-6">
              <span className="gradient-text">Your AI</span>
              <br />
              <span className="text-white">Sales Pre-Closer</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-4 leading-relaxed">
              Qualify leads.<br />
              Detect buying signals.<br />
              Book strategy calls automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup" className="btn-glow bg-[#6366F1] hover:bg-[#5558e3] text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-[#6366F1]/30">
                Start Free Trial →
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
                <div className="flex -space-x-2">
                  {['A','B','C','D'].map((l,i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8b5cf6] flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#000000]">{l}</div>
                  ))}
                </div>
                <span>150+ businesses</span>
              </div>
              <div className="flex items-center gap-1.5">
                {Array(5).fill(0).map((_,i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Liquid Metal Ball */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none flex flex-col items-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#6366F1]/20 via-[#8b5cf6]/10 to-[#06b6d4]/15 rounded-full blur-[80px] opacity-60 pointer-events-none" />
            <div className="relative z-10">
              <LiquidMetalBall />
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO SECTION ── */}
      <section id="demo" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">Live Demo</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Watch AI close in real-time</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">See exactly how Pre-Closer AI qualifies leads, detects buying signals, and books calls — all automatically.</p>
          </div>
          <div className="reveal">
            <ProductSimulation />
          </div>
        </div>
      </section>

      {/* ── PROOF / METRICS ── */}
      <section className="py-16 px-6 border-y border-[#1F2937]/40 bg-[#000000]">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center reveal">
          {[
            { value: '150+', label: 'Businesses using AI assistant' },
            { value: '$70M+', label: 'Revenue generated' },
            { value: '35,000+', label: 'Leads qualified' },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-black text-[#6366F1] mb-1">{item.value}</div>
              <div className="text-xs md:text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center reveal">
          <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-6">The Problem</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 leading-tight">
            Sales teams waste hours on{' '}
            <span className="line-through text-gray-600">unqualified leads</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Our AI filters serious prospects before they reach your calendar.
            Every unqualified call costs you money and morale.
          </p>
        </div>
        <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          {[
            { stat: '68%', label: 'of sales time wasted on unqualified prospects' },
            { stat: '4.2x', label: 'more likely to close a pre-qualified lead' },
            { stat: '$127k', label: 'average annual cost of bad lead follow-up' },
          ].map((item, i) => (
            <div key={i} className="reveal-stagger bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-6 text-center">
              <div className="text-4xl font-black text-[#6366F1] mb-2">{item.stat}</div>
              <div className="text-sm text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-32 px-6 bg-[#000000] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20 reveal">
            <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Four steps to close faster</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="absolute top-16 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent hidden md:block" />
            {[
              { step: '01', icon: '💬', title: 'Lead Opens AI Chat', desc: 'Your prospect clicks the AI chat link from your bio, website, or WhatsApp.' },
              { step: '02', icon: '🔍', title: 'AI Discovers Pain Points', desc: 'The AI asks smart discovery questions to understand needs and goals.' },
              { step: '03', icon: '📊', title: 'Lead Readiness Scored', desc: 'Real-time scoring based on authority, urgency, and buying signals.' },
              { step: '04', icon: '📅', title: 'Qualified Leads Book Calls', desc: 'High-score prospects automatically book a strategy call on your calendar.' },
            ].map((s, i) => (
              <div key={i} className="reveal-stagger flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-2xl mb-1">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-[10px] font-black text-white">{s.step}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ── */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-[#6366F1] text-sm font-semibold tracking-widest uppercase mb-4">Product Preview</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">See what&apos;s waiting inside</h2>
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
                <blockquote className="text-sm text-gray-300 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</blockquote>
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
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-6 reveal">
            <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#a5b4fc] text-xs font-medium px-4 py-2 rounded-full mb-6">
              🚀 50% lifetime discount for the first 200 beta users
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Simple pricing. Massive ROI.</h2>
            <p className="text-gray-400 mt-4">Lock in beta pricing before it&apos;s gone forever.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* Starter */}
            <div className="reveal-stagger feature-card bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-8">
              <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">Starter</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-white">$99</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-600 line-through text-sm">$199/month</span>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">50% off</span>
              </div>
              <p className="text-sm text-gray-400 mb-8">Perfect for solo founders and small sales teams getting started with AI qualification.</p>
              <ul className="space-y-3 mb-8">
                {['500 AI messages/month','AI lead qualification','Lead dashboard','Lead scoring','Public AI assistant link','Deal probability scoring','Basic objection tracking'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-[#6366F1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-[#374151] hover:border-[#6366F1] text-white py-3 rounded-xl font-semibold transition-all text-sm">
                Start Starter Plan
              </Link>
            </div>
            {/* Growth */}
            <div className="reveal-stagger relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#6366F1] to-[#6366F1]/30 z-0" />
              <div className="relative bg-[#0a0a0a] rounded-2xl p-8 z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Growth</p>
                  <span className="text-xs bg-[#6366F1] text-white px-2.5 py-1 rounded-full font-semibold">Recommended ⭐</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-black text-white">$199</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-600 line-through text-sm">$399/month</span>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">50% off</span>
                </div>
                <p className="text-sm text-gray-400 mb-8">The complete AI sales system. Unlimited messages and the full feature suite.</p>
                <ul className="space-y-3 mb-8">
                  {[
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
                    'Objection intelligence',
                    'Funnel leak detector',
                    'AI follow-up writer',
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-[#6366F1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="btn-glow block text-center bg-[#6366F1] hover:bg-[#5558e3] text-white py-3 rounded-xl font-semibold transition-all text-sm shadow-lg shadow-[#6366F1]/30">
                  Get Growth Plan →
                </Link>
              </div>
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
            Get Started Free →
          </Link>
          <p className="text-gray-600 text-xs mt-4">No credit card required. Beta pricing locked in forever.</p>
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
