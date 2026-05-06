"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

/* ── Particle Background ── */
function StarParticles() {
  const c = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = c.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let id: number;
    const stars: {x:number;y:number;r:number;o:number;s:number}[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < 80; i++) stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*1.2+0.2, o: Math.random()*0.5+0.1, s: Math.random()*0.3+0.05 });
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      stars.forEach(s => { s.o += Math.sin(Date.now()*0.001*s.s)*0.003; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(200,200,210,${Math.max(0.05,Math.min(0.5,s.o))})`; ctx.fill(); });
      id = requestAnimationFrame(draw);
    }; draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={c} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ── Floating Geometric ── */
function FloatingGeo() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let t = 0; let id: number;
    const anim = () => { t += 0.008; el.style.transform = `translateY(${Math.sin(t)*12}px) rotateY(${t*20}deg) rotateX(${Math.sin(t*0.7)*10}deg)`; id = requestAnimationFrame(anim); };
    anim(); return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div ref={ref} className="w-32 h-32 md:w-48 md:h-48 relative" style={{perspective:'600px',transformStyle:'preserve-3d'}}>
      <div className="absolute inset-0 border border-white/10 rounded-2xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm" style={{transform:'rotateX(20deg) rotateY(20deg)'}} />
      <div className="absolute inset-4 border border-white/5 rounded-xl bg-gradient-to-tr from-white/3 to-transparent" style={{transform:'rotateX(-10deg) rotateY(-15deg) translateZ(20px)'}} />
    </div>
  );
}

/* ── Countdown Timer ── */
function CountdownTimer() {
  const [t, setT] = useState({d:0,h:0,m:0,s:0});
  useEffect(() => {
    const end = new Date(); end.setDate(end.getDate() + 5); end.setHours(23,59,59);
    const tick = () => { const diff = Math.max(0, end.getTime()-Date.now()); setT({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) }); };
    tick(); const i = setInterval(tick, 1000); return () => clearInterval(i);
  }, []);
  return (
    <div className="flex gap-3 justify-center">
      {[{v:t.d,l:'Days'},{v:t.h,l:'Hours'},{v:t.m,l:'Min'},{v:t.s,l:'Sec'}].map((x,i) => (
        <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 min-w-[60px] text-center">
          <div className="text-xl md:text-2xl font-bold text-white tabular-nums">{String(x.v).padStart(2,'0')}</div>
          <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{x.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ── FAQ Item ── */
function FaqItem({q,a}:{q:string;a:string}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-5 text-left group">
        <span className="text-sm md:text-base text-gray-200 font-medium group-hover:text-white transition-colors pr-4">{q}</span>
        <svg className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && <p className="text-sm text-gray-400 pb-5 leading-relaxed">{a}</p>}
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
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('opacity-100','translate-y-0'); e.target.classList.remove('opacity-0','translate-y-6'); }});
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-up').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Thank you. We will contact you shortly.');
    setTimeout(() => setFormStatus(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <StarParticles />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M9 2L15.5 12H2.5L9 2Z" fill="white" fillOpacity="0.8"/></svg>
          </div>
          <span className="text-sm font-semibold text-gray-200 tracking-tight">Pre Closer</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-xs text-gray-500">
          <a href="#problem" className="hover:text-gray-300 transition-colors">Problem</a>
          <a href="#how" className="hover:text-gray-300 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-gray-300 transition-colors">Pricing</a>
          <a href="#book" className="hover:text-gray-300 transition-colors">Book Call</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors hidden md:block">Sign in</Link>
          <a href="#book" className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-lg font-medium transition-all">Book Audit</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-5 md:px-10">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] text-gray-400 text-[11px] font-medium px-4 py-2 rounded-full mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Limited onboarding slots available this month
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-gray-100">
              Find Out Where Your Agency Is{' '}
              <span className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent">Losing Clients & Revenue.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              We analyze your lead generation, follow-up, and conversion process to identify hidden growth leaks and missed opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="#pricing" className="relative bg-white text-black px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:-translate-y-0.5">
                Book Growth Audit
              </a>
              <a href="#book" className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-200 border border-white/10 hover:border-white/20 px-7 py-3.5 rounded-xl font-medium text-sm transition-all">
                Schedule Free Call
              </a>
            </div>
            <p className="text-xs text-gray-600 mt-8 max-w-md mx-auto lg:mx-0">
              Trusted by growing agencies looking to improve conversions and client consistency.
            </p>
          </div>
          <div className="flex-1 flex justify-center items-center"><FloatingGeo /></div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="py-20 md:py-28 px-5 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-3">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100">Most Agencies Lose Revenue Quietly.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {icon:'📉',title:'Lead Leakage',desc:'Potential clients drop off before becoming paying customers.'},
              {icon:'⏱️',title:'Weak Follow-Up',desc:'Inconsistent or delayed follow-ups reduce conversion opportunities.'},
              {icon:'🔒',title:'Conversion Bottlenecks',desc:'Small inefficiencies compound into significant monthly revenue loss.'},
            ].map((c,i) => (
              <div key={i} className="reveal-up opacity-0 translate-y-6 transition-all duration-700 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 hover:-translate-y-1 transition-all group">
                <div className="text-2xl mb-4">{c.icon}</div>
                <h3 className="text-base font-semibold text-gray-200 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 md:py-28 px-5 md:px-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100">How Pre Closer Works</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block" />
            {[
              {n:'01',title:'Analyze',desc:'We analyze your current lead and sales process.'},
              {n:'02',title:'Identify',desc:'We identify conversion gaps, follow-up weaknesses, and possible revenue leakage.'},
              {n:'03',title:'Deliver',desc:'You receive a structured growth report with actionable recommendations.'},
            ].map((s,i) => (
              <div key={i} className={`reveal-up opacity-0 translate-y-6 transition-all duration-700 flex items-start gap-5 mb-10 last:mb-0 ${i%2===1?'md:flex-row-reverse md:text-right':''}`}>
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">{s.n}</div>
                <div>
                  <h3 className="text-base font-semibold text-gray-200 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-md">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-20 md:py-28 px-5 md:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-3">Deliverables</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100">What&#39;s Included In The Growth Audit</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Lead Flow Analysis','Conversion Rate Review','Follow-Up Analysis','Revenue Leak Insights','Pipeline Optimization','Growth Opportunity Breakdown','Client Conversion Mapping','Action Plan Recommendations'].map((f,i) => (
              <div key={i} className="reveal-up opacity-0 translate-y-6 transition-all duration-700 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-white/10 hover:bg-white/[0.03] transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/></svg>
                </div>
                <p className="text-sm font-medium text-gray-300">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 md:py-28 px-5 md:px-10 border-t border-white/5">
        <div className="max-w-lg mx-auto text-center">
          <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-3">Investment</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100 mb-12">Growth Audit</h2>
          </div>
          <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 md:p-10">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-bold text-white">₹2,999</span>
            </div>
            <p className="text-xs text-gray-500 mb-8">One-Time Professional Growth Audit</p>
            <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
              {['Lead & Conversion Analysis','Follow-Up Gap Detection','Revenue Leak Insights','Actionable Growth Recommendations','Detailed Audit Breakdown','Personalized Improvement Suggestions'].map((f,i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-emerald-500/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#book" className="block w-full bg-white text-black py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:-translate-y-0.5">
              Book Your Audit
            </a>
          </div>
          <div className="mt-10 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-xs text-gray-500 mb-4">Current onboarding window closes in:</p>
            <CountdownTimer />
            <p className="text-[11px] text-gray-600 mt-4">Limited audit slots available to maintain personalized analysis quality.</p>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-20 md:py-28 px-5 md:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100 mb-4">Built For Modern Agencies</h2>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['Digital Marketing','SEO','Performance Marketing','Web Development','Creative'].map((t,i) => (
                <span key={i} className="text-[11px] text-gray-400 bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-full">{t} Agencies</span>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {q:"Helped us identify major follow-up gaps.",a:"Rahul M.",r:"Agency Founder"},
              {q:"The audit gave us a clearer view of our conversion process.",a:"Sneha K.",r:"Marketing Lead"},
              {q:"Very structured and insightful.",a:"Arjun P.",r:"Growth Director"},
            ].map((t,i) => (
              <div key={i} className="reveal-up opacity-0 translate-y-6 transition-all duration-700 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <p className="text-sm text-gray-300 leading-relaxed mb-5 italic">&ldquo;{t.q}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-semibold text-gray-400">{t.a[0]}</div>
                  <div><div className="text-xs font-medium text-gray-300">{t.a}</div><div className="text-[10px] text-gray-600">{t.r}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK A CALL */}
      <section id="book" className="py-20 md:py-28 px-5 md:px-10 border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-3">Get Started</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100 mb-3">Book A Growth Call</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">Speak with Pre Closer to understand whether hidden conversion gaps may be affecting your agency&#39;s growth.</p>
          </div>
          <form onSubmit={handleSubmit} className="reveal-up opacity-0 translate-y-6 transition-all duration-700 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 space-y-4">
            {[{l:'Name',k:'name',t:'text',p:'Your name'},{l:'Agency Name',k:'agency',t:'text',p:'Agency name'},{l:'Email',k:'email',t:'email',p:'you@agency.com'},{l:'Phone',k:'phone',t:'tel',p:'+91 XXXXXXXXXX'},{l:'Agency Size',k:'size',t:'text',p:'e.g. 5-10 people'}].map((f,i) => (
              <div key={i}>
                <label className="block text-[11px] font-medium text-gray-400 mb-1.5 tracking-wide uppercase">{f.l}</label>
                <input type={f.t} required placeholder={f.p} value={(formData as any)[f.k]} onChange={e => setFormData({...formData,[f.k]:e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors" />
              </div>
            ))}
            <button type="submit" className="w-full bg-white text-black py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:-translate-y-0.5 mt-2">
              Schedule Call
            </button>
            {formStatus && <p className="text-sm text-emerald-400 text-center mt-3">{formStatus}</p>}
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-5 md:px-10 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100">Frequently Asked Questions</h2>
          </div>
          <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700">
            <FaqItem q="What exactly is the Growth Audit?" a="A professional analysis of your agency's lead generation, follow-up systems, and conversion process. We identify where potential revenue is being lost and provide actionable recommendations." />
            <FaqItem q="How is revenue leakage identified?" a="We analyze your entire client acquisition funnel — from initial lead contact to conversion — looking for gaps, delays, and inefficiencies that cause prospects to drop off." />
            <FaqItem q="What do we receive after the audit?" a="A detailed growth report with specific findings, identified gaps, and a prioritized action plan with recommendations tailored to your agency." />
            <FaqItem q="Who is this for?" a="Digital marketing agencies, SEO agencies, performance marketing teams, web development agencies, and creative agencies looking to improve client acquisition and retention." />
            <FaqItem q="How long does the audit take?" a="The analysis typically takes 3-5 business days. You'll receive your complete growth report with findings and recommendations." />
            <FaqItem q="Is this a software or a consulting service?" a="Pre Closer combines analytical tools with professional consulting expertise to deliver structured, data-informed growth audits." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-5 md:px-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none"><path d="M9 2L15.5 12H2.5L9 2Z" fill="white" fillOpacity="0.7"/></svg>
            </div>
            <span className="text-xs font-semibold text-gray-400">Pre Closer</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] text-gray-600">
            <span>Contact: 9238798130</span>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-gray-400 transition-colors">Login</Link>
          </div>
          <p className="text-[11px] text-gray-700">© 2025 Pre Closer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
