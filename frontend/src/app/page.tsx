"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

/* ── Twinkling Star Background ── */
function TwinklingStars() {
  const c = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = c.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let id: number;
    const stars: {x:number;y:number;r:number;baseO:number;speed:number;phase:number}[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = document.body.scrollHeight; };
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < 250; i++) stars.push({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      r: Math.random()*1.8+0.3, baseO: Math.random()*0.5+0.1,
      speed: Math.random()*1.5+0.5, phase: Math.random()*Math.PI*2
    });
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const t = Date.now()*0.001;
      stars.forEach(s => {
        const twinkle = Math.sin(t*s.speed+s.phase)*0.5+0.5;
        const o = s.baseO + twinkle*0.6;
        const r = s.r*(0.8+twinkle*0.5);
        ctx.beginPath(); ctx.arc(s.x,s.y,r,0,Math.PI*2);
        ctx.fillStyle=`rgba(220,230,255,${o})`; ctx.fill();
        if(twinkle>0.8){
          ctx.beginPath();ctx.arc(s.x,s.y,r*3,0,Math.PI*2);
          ctx.fillStyle=`rgba(200,220,255,${o*0.2})`;ctx.fill();
        }
      });
      id = requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={c} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ── FAQ Item ── */
function FaqItem({q,a}:{q:string;a:string}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-5 text-left group">
        <span className="text-sm md:text-base text-gray-200 font-medium group-hover:text-indigo-300 transition-colors pr-4">{q}</span>
        <svg className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${open?'rotate-180 text-indigo-400':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
        <p className="text-sm text-gray-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function LandingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({name:'',agency:'',email:'',phone:'',size:''});
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.get('/user/me').then(r => {
      if (r.data.plan === 'BETA' || r.data.subscriptionStatus === 'ACTIVE') router.push('/dashboard');
    }).catch(() => localStorage.removeItem('token'));
  }, [router]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e,i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i*80); }});
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal-up,.reveal-left,.reveal-scale').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Thank you. We will contact you shortly.');
    setTimeout(() => setFormStatus(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative noise-bg selection:bg-indigo-500/30">
      <TwinklingStars />
      <div className="glow-blur w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] bg-indigo-500/15 top-[-10%] left-[-10%]"></div>
      <div className="glow-blur w-[1000px] h-[1000px] md:w-[1400px] md:h-[1400px] bg-purple-500/10 bottom-0 right-[-10%]" style={{ animationDelay: '2s' }}></div>
      <div className="glow-blur w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-emerald-500/10 top-[30%] left-[20%]" style={{ animationDelay: '4s' }}></div>
      
      {/* Increased Particle Density for Depth */}
      {[...Array(40)].map((_, i) => (
        <div key={`p-${i}`} className="particle absolute rounded-full bg-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{
          width: Math.random() * 8 + 3 + 'px',
          height: Math.random() * 8 + 3 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 15 + 10}s`
        }} />
      ))}

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-4 bg-[#050505]/70 backdrop-blur-xl border-b border-white/5 transition-all">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M9 2L15.5 12H2.5L9 2Z" fill="white" fillOpacity="0.9"/></svg>
          </div>
          <span className="text-sm font-bold text-gray-100 tracking-tight">Pre Closer</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-400">
          <a href="#how" className="hover:text-white transition-colors">How It Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#book" className="hover:text-white transition-colors">Book Demo</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-medium text-gray-400 hover:text-white transition-colors hidden md:block">Sign in</Link>
          <a href="#book" className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">Get Started</a>
        </div>
      </nav>

      {/* HERO & DEMO */}
      <section className="relative min-h-[100vh] flex flex-col items-center pt-32 pb-20 px-5 md:px-10 z-10">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center gap-8 relative z-10">
          <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] text-gray-300 text-[11px] md:text-xs font-medium px-5 py-2.5 rounded-full tracking-wide shadow-lg shadow-black/20 backdrop-blur-md">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Premium AI-Powered Agency Growth System
          </div>
          
          <h1 className="reveal-up opacity-0 translate-y-6 transition-all duration-700 delay-100 hero-heading text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-gray-100 max-w-4xl mx-auto">
            Manage Leads, Automate Follow-Ups & <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">Improve Conversions.</span>
          </h1>
          
          <p className="reveal-up opacity-0 translate-y-6 transition-all duration-700 delay-200 text-base md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Pre Closer helps agencies organize leads, automate follow-ups, track conversions, and manage client flow through a modern AI-powered dashboard.
          </p>
          
          <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 delay-300 flex flex-col sm:flex-row gap-4 justify-center mt-2 w-full sm:w-auto">
            <a href="#pricing" className="w-full sm:w-auto relative bg-white text-black px-8 py-4 rounded-xl font-bold text-sm md:text-base transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] duration-300 text-center">
              Start Free Trial
            </a>
            <a href="#book" className="w-full sm:w-auto flex items-center justify-center gap-3 text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 px-8 py-4 rounded-xl font-bold text-sm md:text-base transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] duration-300">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
              Book A Demo
            </a>
          </div>
        </div>

        {/* Embedded Demo Video inside Hero */}
        <div id="demo" className="w-full max-w-5xl mx-auto mt-20 relative reveal-up opacity-0 translate-y-10 transition-all duration-1000 delay-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-3xl blur opacity-30 animate-pulse" />
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden glass-premium border border-white/20 shadow-[0_0_80px_rgba(99,102,241,0.2)] aspect-[16/9] group bg-[#050505]">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 scale-[1.02] group-hover:scale-100"
              src="/demo.mp4"
              poster="/demo.webp"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none transition-opacity duration-700 group-hover:opacity-50" />
            
            {/* Overlay UI elements to make it feel real and immersive */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-xl">
               <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
               <span className="text-[9px] md:text-xs font-bold text-white tracking-wider uppercase">Live Dashboard Demo</span>
            </div>
            
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 hidden sm:flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl shadow-xl">
               <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full border-2 border-black bg-indigo-500 flex items-center justify-center text-[10px] font-bold">JD</div>
                 <div className="w-8 h-8 rounded-full border-2 border-black bg-emerald-500 flex items-center justify-center text-[10px] font-bold">AS</div>
                 <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] font-bold">+3</div>
               </div>
               <span className="text-[10px] md:text-xs font-semibold text-gray-300">Team Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section-pad py-24 md:py-32 px-5 md:px-10 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 md:mb-24 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mb-4">The Workflow</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-100">How Pre Closer Works</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base">A seamless pipeline designed to move prospects from discovery to closed deals with zero friction.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent hidden md:block" />
            {[
              {n:'01',title:'Centralize Leads',desc:'Import or directly sync your leads into one unified, intelligent platform.'},
              {n:'02',title:'AI Qualification',desc:'The system automatically analyzes and scores leads so you know exactly who to prioritize.'},
              {n:'03',title:'Automated Outreach',desc:'Smart, timing-optimized follow-ups and reminders trigger automatically.'},
              {n:'04',title:'Monitor Velocity',desc:'Track responses, pipeline movement, and conversion analytics in real-time.'},
              {n:'05',title:'Close & Scale',desc:'Focus human effort only on ready-to-buy prospects, increasing overall agency revenue.'},
            ].map((s,i) => (
              <div key={i} className={`reveal-up opacity-0 translate-y-10 transition-all duration-700 flex items-start gap-6 md:gap-10 mb-12 last:mb-0 ${i%2===1?'md:flex-row-reverse md:text-right':''}`}>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg md:text-xl font-bold text-indigo-400 shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative z-10 backdrop-blur-md">
                  {s.n}
                </div>
                <div className={`glass-premium p-6 rounded-2xl border border-white/[0.05] flex-1 hover:border-white/10 transition-colors ${i%2===1?'md:mr-8':'md:ml-8'}`}>
                  <h3 className="text-lg md:text-xl font-bold text-gray-100 mb-2">{s.title}</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE EXPLANATION SECTION */}
      <section id="features" className="py-24 md:py-32 px-5 md:px-10 relative border-t border-white/5 overflow-hidden bg-black/20">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mb-4">Core Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-100 max-w-3xl mx-auto leading-tight">
              Everything You Need To <br className="hidden md:block"/> Turn Leads Into Revenue
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="reveal-up opacity-0 translate-y-10 transition-all duration-700 glass-premium rounded-3xl p-8 hover:shadow-[0_0_60px_rgba(99,102,241,0.15)] group relative overflow-hidden flex flex-col h-full border border-white/10 hover:border-indigo-500/30 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-6">AI Lead Qualification</h3>
              <div className="space-y-5 flex-grow">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">What it does</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">Automatically organizes and prioritizes incoming leads based on intent and fit using intelligent scoring.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Why it matters</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">Saves hours of manual sorting and ensures your team doesn't miss high-value prospects hidden in the noise.</p>
                </div>
                <div className="pt-2">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Agency Benefit</h4>
                    <p className="text-xs text-indigo-100/80 leading-relaxed">Allows your sales team to focus 100% of their energy on closing higher-quality opportunities.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="reveal-up opacity-0 translate-y-10 transition-all duration-700 delay-100 glass-premium rounded-3xl p-8 hover:shadow-[0_0_60px_rgba(16,185,129,0.15)] group relative overflow-hidden flex flex-col h-full border border-white/10 hover:border-emerald-500/30 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-6">Follow-Up Automation</h3>
              <div className="space-y-5 flex-grow">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">What it does</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">Triggers personalized, timed outreach sequences and internal reminders across channels.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Why it matters</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">Most deals require 5-7 touchpoints. Automation ensures nobody falls through the cracks due to human forgetfulness.</p>
                </div>
                <div className="pt-2">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Agency Benefit</h4>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">Reduces missed opportunities and significantly increases conversion rates without adding staff.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="reveal-up opacity-0 translate-y-10 transition-all duration-700 delay-200 glass-premium rounded-3xl p-8 hover:shadow-[0_0_60px_rgba(236,72,153,0.15)] group relative overflow-hidden flex flex-col h-full border border-white/10 hover:border-pink-500/30 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-6">Conversion Tracking</h3>
              <div className="space-y-5 flex-grow">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">What it does</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">Monitors the entire client journey, identifying pipeline velocity, drop-off points, and ROI.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Why it matters</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">You cannot fix what you cannot measure. Clear visibility highlights exactly where your process leaks money.</p>
                </div>
                <div className="pt-2">
                  <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
                    <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1">Agency Benefit</h4>
                    <p className="text-xs text-pink-100/80 leading-relaxed">Provides actionable insights to patch revenue leaks and predictably scale your agency's growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 md:py-32 px-5 md:px-10 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase mb-4">Investment Value</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-100 mb-6">Scale Without Adding Headcount</h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Pre Closer gives you the capabilities of a full-time sales assistant—organizing leads, sending follow-ups, and tracking conversions—at a fraction of the cost of hiring.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Starter */}
            <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium rounded-3xl p-8 relative flex flex-col border border-white/10 hover:border-white/20 hover:bg-white/[0.03] group">
              <h3 className="text-xl font-bold text-gray-100 mb-2">Starter</h3>
              <p className="text-sm text-gray-400 mb-6">Perfect for solo consultants or small agency teams getting started.</p>
              <div className="mb-8"><span className="text-4xl md:text-5xl font-extrabold text-white">₹999</span><span className="text-sm font-medium text-gray-500">/mo</span></div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">What you get</div>
                <ul className="space-y-4 mb-8">
                  {['100 leads per month','AI lead summaries','Follow-up reminders','Basic pipeline dashboard','1 team member'].map((f,i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-emerald-500/70 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/signup" className="block w-full bg-white/5 hover:bg-white/10 text-white text-center py-4 rounded-xl font-bold text-sm transition-all border border-white/10 group-hover:border-white/20">Start Free Trial</a>
            </div>

            {/* Growth */}
            <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-3xl p-8 relative flex flex-col transform md:-translate-y-4 shadow-[0_0_60px_rgba(99,102,241,0.15)] hover:shadow-[0_0_80px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/50">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
              <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
              <p className="text-sm text-indigo-200/70 mb-6">For scaling agencies that need powerful automation to save time.</p>
              <div className="mb-8"><span className="text-4xl md:text-5xl font-extrabold text-white">₹2,999</span><span className="text-sm font-medium text-gray-400">/mo</span></div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest mb-4">What you get</div>
                <ul className="space-y-4 mb-8">
                  {['1,000 leads per month','AI qualification & scoring','Automated follow-up flows','Conversion analytics dashboard','WhatsApp integration','5 team members','Admin controls'].map((f,i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-100">
                      <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/signup" className="block w-full bg-white text-black text-center py-4 rounded-xl font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]">Start Free Trial</a>
            </div>

            {/* Scale */}
            <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium rounded-3xl p-8 relative flex flex-col border border-white/10 hover:border-white/20 hover:bg-white/[0.03] group">
              <h3 className="text-xl font-bold text-gray-100 mb-2">Scale</h3>
              <p className="text-sm text-gray-400 mb-6">For high-volume international agencies focusing on optimization.</p>
              <div className="mb-8"><span className="text-4xl md:text-5xl font-extrabold text-white">$99</span><span className="text-sm font-medium text-gray-500">/mo</span></div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">What you get</div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited leads','Advanced ROI analytics','Team performance tracking','AI workflow recommendations','Email + WhatsApp automation','Advanced pipeline stages','10 team members'].map((f,i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-emerald-500/70 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/signup" className="block w-full bg-white/5 hover:bg-white/10 text-white text-center py-4 rounded-xl font-bold text-sm transition-all border border-white/10 group-hover:border-white/20">Start Free Trial</a>
            </div>

            {/* Enterprise */}
            <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium rounded-3xl p-8 relative flex flex-col border border-white/10 hover:border-white/20 hover:bg-white/[0.03] group">
              <h3 className="text-xl font-bold text-gray-100 mb-2">Enterprise</h3>
              <p className="text-sm text-gray-400 mb-6">Custom requirements, white-labeling, and dedicated support.</p>
              <div className="mb-8"><span className="text-4xl md:text-5xl font-extrabold text-white">$199</span><span className="text-sm font-medium text-gray-500">/mo</span></div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">What you get</div>
                <ul className="space-y-4 mb-8">
                  {['Everything in Scale','Custom AI workflows','API & Webhook access','Priority onboarding call','White-label options','Unlimited team members','Dedicated support agent'].map((f,i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-emerald-500/70 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="#book" className="block w-full bg-white/5 hover:bg-white/10 text-white text-center py-4 rounded-xl font-bold text-sm transition-all border border-white/10 group-hover:border-white/20">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-24 md:py-32 px-5 md:px-10 border-t border-white/5 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-100 mb-6">Built For Modern Agencies</h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Join forward-thinking agencies that have stopped leaking revenue and started scaling predictable systems.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['Digital Marketing','SEO','Performance Marketing','Web Development','Creative'].map((t,i) => (
                <span key={i} className="text-xs font-medium text-gray-300 bg-white/[0.05] border border-white/[0.1] px-5 py-2.5 rounded-full hover:bg-white/[0.1] transition-colors cursor-default">{t} Agencies</span>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {q:"It completely organized our chaotic pipeline. The automated follow-ups alone saved us thousands in lost deals.",a:"Rahul M.",r:"Agency Founder"},
              {q:"The AI qualification helps our small team punch above our weight. We only talk to leads that are ready.",a:"Sneha K.",r:"Marketing Lead"},
              {q:"Very structured, very clean. Our closing rate went up simply because we stopped forgetting to reply.",a:"Arjun P.",r:"Growth Director"},
            ].map((t,i) => (
              <div key={i} className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] cursor-default rounded-3xl p-8 border border-white/5 hover:border-white/10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_,star) => <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8 italic">&ldquo;{t.q}&rdquo;</p>
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-gray-200">{t.a[0]}</div>
                  <div><div className="text-sm font-bold text-gray-200">{t.a}</div><div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mt-0.5">{t.r}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK A CALL */}
      <section id="book" className="py-24 md:py-32 px-5 md:px-10 border-t border-white/5 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-center mb-12 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mb-4">Get Started</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-100 mb-4">See It On Your Leads</h2>
            <p className="text-base text-gray-400 max-w-md mx-auto leading-relaxed">Book a quick demo to see exactly how Pre Closer integrates into your agency's current workflow.</p>
          </div>
          <form onSubmit={handleSubmit} className="reveal-up opacity-0 translate-y-6 transition-all duration-700 bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 md:p-10 space-y-5 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {[{l:'Name',k:'name',t:'text',p:'Your full name'},{l:'Agency Name',k:'agency',t:'text',p:'Agency name'},{l:'Email',k:'email',t:'email',p:'you@agency.com'},{l:'Phone',k:'phone',t:'tel',p:'+91 XXXXXXXXXX'},{l:'Agency Size',k:'size',t:'text',p:'e.g. 5-10 people'}].map((f,i) => (
              <div key={i}>
                <label className="block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">{f.l}</label>
                <input type={f.t} required placeholder={f.p} value={(formData as any)[f.k]} onChange={e => setFormData({...formData,[f.k]:e.target.value})}
                  className="w-full bg-[#050505]/50 border border-white/[0.1] rounded-xl px-5 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" />
              </div>
            ))}
            <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm md:text-base transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] mt-4">
              Schedule Live Demo
            </button>
            {formStatus && <p className="text-sm font-medium text-emerald-400 text-center mt-4 bg-emerald-500/10 py-3 rounded-lg border border-emerald-500/20">{formStatus}</p>}
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 px-5 md:px-10 border-t border-white/5 bg-black/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-100">Frequently Asked Questions</h2>
          </div>
          <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium rounded-3xl p-6 md:p-10 border border-white/10">
            <FaqItem q="How does the AI lead qualification work?" a="Pre Closer analyzes incoming lead data, intent signals, and historical patterns to score each prospect. High-intent leads are flagged for immediate human attention, while others enter automated nurturing." />
            <FaqItem q="Can I customize the automated follow-ups?" a="Yes. You can build custom workflows with specific delays, tailored messaging, and multichannel touchpoints (Email, WhatsApp) to match your agency's exact sales process." />
            <FaqItem q="Is it difficult to migrate from our current CRM?" a="Not at all. We provide easy CSV imports, API access, and integrations to seamlessly move your existing leads into Pre Closer without disrupting your active pipeline." />
            <FaqItem q="Who is Pre Closer built for?" a="It's specifically designed for Digital Marketing, SEO, Web Development, and Performance Marketing agencies that manage a steady flow of inbound leads and need a structured way to close them." />
            <FaqItem q="Do I need technical skills to set it up?" a="No. The platform is designed to be intuitive and ready-to-use. Plus, our Growth and higher plans come with onboarding support to ensure your workflows are configured perfectly." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-5 md:px-10 bg-[#020202]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M9 2L15.5 12H2.5L9 2Z" fill="white" fillOpacity="0.9"/></svg>
            </div>
            <span className="text-sm font-bold text-gray-300">Pre Closer</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> 9238798130</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/login" className="hover:text-white transition-colors">Client Login</Link>
          </div>
          <p className="text-[11px] font-medium text-gray-600">© {new Date().getFullYear()} Pre Closer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
