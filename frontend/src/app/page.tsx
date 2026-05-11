"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

/* ── Grey 3D Mesh Background ── */
function GreyMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
    
    const rows = 15;
    const cols = 25;
    const spacing = 90;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.003; // slower, elegant movement
      
      const points = [];
      const offsetY = canvas.height * 0.15; // Shift grid to center nicely
      
      // Calculate 3D points
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i - cols/2) * spacing;
          const y = (j - rows/2) * spacing;
          
          // Flowing wave effect
          const z = Math.sin(i * 0.2 + time) * 60 + Math.cos(j * 0.2 + time * 1.5) * 60;
          
          // Tilt the mesh to look 3D
          const angleX = Math.PI / 2.5;
          const angleZ = time * 0.1;
          
          // Rotate Z
          const x1 = x * Math.cos(angleZ) - y * Math.sin(angleZ);
          const y1 = x * Math.sin(angleZ) + y * Math.cos(angleZ);
          
          // Rotate X
          const y2 = y1 * Math.cos(angleX) - z * Math.sin(angleX);
          const z2 = y1 * Math.sin(angleX) + z * Math.cos(angleX);
          
          // Project to 2D
          const fov = 1000;
          const distance = 800;
          const scale = fov / (fov + z2 + distance);
          
          points.push({
            x: x1 * scale + canvas.width / 2,
            y: y2 * scale + canvas.height / 2 + offsetY,
            z: z2,
            scale
          });
        }
      }
      
      ctx.lineWidth = 1;
      
      // Draw connecting lines
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          const p = points[idx];
          
          // Dynamic fade based on distance from center and Z-depth
          const distFromCenter = Math.abs(p.x - canvas.width/2) / (canvas.width/2);
          const opacity = Math.max(0, 0.25 - distFromCenter * 0.2 - (p.z + 50) * 0.001);
          
          if (opacity <= 0) continue;
          
          ctx.strokeStyle = `rgba(140, 150, 170, ${opacity})`;
          
          if (i < cols - 1) {
            const right = points[(i + 1) * rows + j];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }
          
          if (j < rows - 1) {
            const bottom = points[i * rows + (j + 1)];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(bottom.x, bottom.y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ── SimulatedDemo Component ── */
function SimulatedDemo() {
  const [mode, setMode] = useState<'inbound' | 'outbound'>('inbound');
  const [step, setStep] = useState(0);

  useEffect(() => {
    let currentStep = 0;
    const intervals = {
      inbound: [1500, 2500, 2500, 3000, 2500, 3500, 6000], // 0->6
      outbound: [1000, 2000, 2500, 2000, 2500, 3000, 5000] // 0->6
    };
    let timeoutId: NodeJS.Timeout;

    const runSequence = () => {
      timeoutId = setTimeout(() => {
        currentStep++;
        const maxSteps = 6;
        if (currentStep > maxSteps) currentStep = 0;
        setStep(currentStep);
        runSequence();
      }, intervals[mode][currentStep % intervals[mode].length]);
    };

    runSequence();
    return () => {
      clearTimeout(timeoutId);
      currentStep = 0;
      setStep(0);
    };
  }, [mode]);

  return (
    <>
      <style>{`
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 15px rgba(99,102,241,0.2); } 50% { box-shadow: 0 0 25px rgba(99,102,241,0.5); } }
        .animate-pulse-glow { animation: pulseGlow 2s infinite; }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .animate-scan { animation: scanline 3s linear infinite; }
      `}</style>
      
      <div className="w-full h-full bg-[#050505] flex flex-col relative overflow-hidden text-sm font-sans rounded-2xl md:rounded-3xl border border-white/20 shadow-[0_0_80px_rgba(99,102,241,0.2)]">
        
        {/* Top Toggle Bar */}
        <div className="bg-[#0B0F19] border-b border-white/[0.08] p-3 flex justify-center gap-2 relative z-20">
          <button 
            onClick={() => { setMode('inbound'); setStep(0); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${mode === 'inbound' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Starter / Growth (Inbound)
          </button>
          <button 
            onClick={() => { setMode('outbound'); setStep(0); }}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 ${mode === 'outbound' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Elite Plan (Outbound Engine)
          </button>
        </div>

        {mode === 'inbound' ? (
          /* INBOUND DEMO (Original) */
          <div className="flex-1 bg-[#030303] p-5 md:p-8 relative flex flex-col min-h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent pointer-events-none" />
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-white font-extrabold text-xl md:text-2xl flex items-center gap-3">
                  Live Pipeline <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Real-time</span>
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="bg-indigo-500/20 border border-indigo-500/50 px-4 py-2 rounded-xl text-xs text-indigo-300 font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                  AI Agent Active
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 flex-1 relative z-10">
               {/* New Leads Column */}
               <div className="bg-[#080808] border border-white/[0.08] rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest">New Leads</h4>
                   <span className="bg-white/10 text-gray-300 text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">{step >= 4 && step < 5 ? '2' : '1'}</span>
                 </div>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 opacity-50">
                   <div className="text-gray-300 text-sm font-bold">Mike T.</div>
                   <div className="text-gray-500 text-[11px] mt-1 font-medium">SaaS Founder</div>
                 </div>

                 {step >= 4 && step < 5 && (
                   <div className="bg-indigo-500/10 border border-indigo-500/40 rounded-2xl p-4 animate-slide-up relative overflow-hidden animate-pulse-glow">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" />
                     <div className="flex justify-between items-start pl-2">
                       <div className="text-white text-sm font-bold">Unknown Prospect</div>
                       <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider">Evaluating</span>
                     </div>
                     <div className="text-indigo-200/70 text-[11px] mt-2 pl-2 font-medium">Needs system for 50-100 leads/mo</div>
                     <div className="mt-4 pl-2 text-[10px] text-indigo-300 flex items-center gap-2 font-bold bg-indigo-500/20 py-1.5 px-2.5 rounded-lg w-fit">
                       <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       AI Scoring & Qualifying...
                     </div>
                   </div>
                 )}
               </div>

               {/* Qualified Column */}
               <div className="bg-[#080808] border border-white/[0.08] rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest">Qualified</h4>
                   <span className="bg-white/10 text-gray-300 text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">{step >= 5 ? '2' : '1'}</span>
                 </div>

                 <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 opacity-50">
                   <div className="text-gray-300 text-sm font-bold">Sarah Jenkins</div>
                   <div className="text-gray-500 text-[11px] mt-1 font-medium">Design Agency • Score: 85</div>
                 </div>

                 {step >= 5 && (
                   <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-slide-up relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                     <div className="flex justify-between items-start pl-2">
                       <div className="text-white text-sm font-bold">Agency Prospect</div>
                       <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-1 rounded font-extrabold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">High Intent</span>
                     </div>
                     <div className="text-emerald-100/70 text-[11px] mt-2 pl-2 font-medium">AI Score: 96/100 • 50-100 leads</div>
                     
                     {step >= 6 && (
                       <div className="mt-4 pl-2 text-[10px] text-emerald-400 flex items-center gap-2 border-t border-emerald-500/20 pt-3 font-bold uppercase tracking-wide">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                         WhatsApp Auto-Pilot Sent
                       </div>
                     )}
                   </div>
                 )}
               </div>

               {/* In Discussion Column */}
               <div className="hidden md:flex bg-[#080808] border border-white/[0.08] rounded-3xl p-5 flex-col gap-4 shadow-xl">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest">In Discussion</h4>
                   <span className="bg-white/10 text-gray-300 text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">1</span>
                 </div>
                 
                 <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 opacity-50">
                   <div className="flex justify-between items-center">
                     <div className="text-gray-300 text-sm font-bold">David R.</div>
                     <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                   </div>
                   <div className="text-gray-500 text-[11px] mt-1 font-medium">Awaiting Reply</div>
                 </div>
               </div>
            </div>
          </div>
        ) : (
          /* OUTBOUND DEMO (Google Maps Scraper) */
          <div className="flex-1 bg-[#030303] p-5 md:p-8 relative flex flex-col min-h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-white font-extrabold text-xl md:text-2xl flex items-center gap-3">
                  Outbound Engine <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Elite</span>
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="bg-amber-500/20 border border-amber-500/50 px-4 py-2 rounded-xl text-xs text-amber-300 font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                  Scraper Active
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-5 relative z-10">
              
              {/* Left: Terminal/Scraper View */}
              <div className="flex-1 bg-[#050505] border border-white/[0.08] rounded-3xl p-5 flex flex-col shadow-xl font-mono relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/[0.08] flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  <span className="text-[10px] text-gray-500 font-sans ml-2">google_maps_extractor.js</span>
                </div>
                
                <div className="mt-10 flex-1 overflow-y-auto space-y-2 text-[11px] md:text-xs">
                  {step >= 0 && <div className="text-gray-400">] Initializing map boundary... [OK]</div>}
                  {step >= 1 && <div className="text-indigo-400 animate-slide-up">] Query: "Marketing Agencies in London, UK"</div>}
                  {step >= 2 && <div className="text-gray-400 animate-slide-up">] Scraping places API... found 412 results.</div>}
                  {step >= 3 && (
                    <div className="text-amber-400 animate-slide-up flex flex-col gap-1">
                      <span>] Enriching data... extracting emails & socials...</span>
                      <span className="text-emerald-400">] + Found: hello@creativeboost.co.uk (Score: 92)</span>
                      <span className="text-emerald-400">] + Found: founders@elevatelondon.com (Score: 88)</span>
                    </div>
                  )}
                  {step >= 4 && <div className="text-white animate-slide-up">] 120 Leads enriched. Pushing to CRM Pipeline...</div>}
                  
                  {step >= 1 && step < 4 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-20 pointer-events-none animate-scan" />
                  )}
                </div>
              </div>

              {/* Right: Pipeline / Action View */}
              <div className="w-full md:w-1/2 flex flex-col gap-5">
                <div className="bg-[#080808] border border-white/[0.08] rounded-3xl p-5 flex flex-col gap-4 shadow-xl flex-1">
                  <h4 className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest">Cold Outreach Queue</h4>
                  
                  {step >= 4 ? (
                    <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 animate-slide-up relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                       <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                       <div className="flex justify-between items-start pl-2">
                         <div className="text-white text-sm font-bold">Creative Boost London</div>
                         <span className="bg-amber-500/20 text-amber-400 text-[9px] px-2 py-1 rounded font-extrabold tracking-widest uppercase">Target</span>
                       </div>
                       <div className="text-amber-100/70 text-[11px] mt-2 pl-2 font-medium">Email: hello@creativeboost.co.uk</div>
                       
                       {step >= 5 && (
                         <div className="mt-4 pl-2 text-[10px] text-emerald-400 flex items-center gap-2 border-t border-emerald-500/20 pt-3 font-bold uppercase tracking-wide animate-slide-up">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                           Cold Sequence Initiated
                         </div>
                       )}
                     </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-600 text-xs font-medium border-2 border-dashed border-white/[0.05] rounded-2xl">
                      Awaiting Scraper Data...
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  )
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
      <GreyMeshBackground />
      <div className="glow-blur w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] bg-indigo-500/15 top-[-10%] left-[-10%]"></div>
      <div className="glow-blur w-[1000px] h-[1000px] md:w-[1400px] md:h-[1400px] bg-purple-500/10 bottom-0 right-[-10%]" style={{ animationDelay: '2s' }}></div>
      <div className="glow-blur w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-emerald-500/10 top-[30%] left-[20%]" style={{ animationDelay: '4s' }}></div>

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
            Modern CRM For Agencies
          </div>
          
          <h1 className="reveal-up opacity-0 translate-y-6 transition-all duration-700 delay-100 hero-heading text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-gray-100 max-w-4xl mx-auto">
            Manage Leads, Automate Follow-Ups & <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">Close More Clients.</span>
          </h1>
          
          <p className="reveal-up opacity-0 translate-y-6 transition-all duration-700 delay-200 text-base md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Stop losing deals in the chaos. Organize leads, automate multi-channel follow-ups, and track your entire sales pipeline from one beautiful dashboard.
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
          
          <p className="reveal-up opacity-0 translate-y-6 transition-all duration-700 delay-400 mt-8 text-sm text-gray-500 font-medium tracking-wide">
            We help agencies identify ideal clients, organize lead pipelines, and automate outbound follow-ups.
          </p>
        </div>

        {/* Dynamic Simulated Demo Component */}
        <div id="demo" className="w-full max-w-5xl mx-auto mt-20 relative reveal-up opacity-0 translate-y-10 transition-all duration-1000 delay-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-3xl blur opacity-30 animate-pulse" />
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden glass-premium border border-white/20 shadow-[0_0_80px_rgba(99,102,241,0.2)] aspect-auto group bg-[#050505]">
            <SimulatedDemo />
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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

            {/* Card 4 */}
            <div className="reveal-up opacity-0 translate-y-10 transition-all duration-700 delay-300 glass-premium rounded-3xl p-8 hover:shadow-[0_0_60px_rgba(245,158,11,0.15)] group relative overflow-hidden flex flex-col h-full border border-white/10 hover:border-amber-500/30 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-6">Outbound Optimization</h3>
              <div className="space-y-5 flex-grow">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">What it does</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">Identify ideal customer profiles, improve lead targeting, and automate follow-up workflows through structured outbound systems.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Why it matters</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">It shifts your agency from relying purely on inbound luck to having a predictable outbound growth engine.</p>
                </div>
                <div className="pt-2">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Agency Benefit</h4>
                    <p className="text-xs text-amber-100/80 leading-relaxed">Gives you a repeatable, automated system for acquiring high-value clients predictably.</p>
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
          
          <div className="grid md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            {/* Starter */}
            <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium rounded-3xl p-8 relative flex flex-col border border-white/10 hover:border-white/20 hover:bg-white/[0.03] group">
              <h3 className="text-xl font-bold text-gray-100 mb-2">Starter</h3>
              <p className="text-sm text-gray-400 mb-6 min-h-[60px]">Perfect for solo consultants or small agency teams getting started.</p>
              <div className="mb-8"><span className="text-4xl md:text-5xl font-extrabold text-white">$99</span><span className="text-sm font-medium text-gray-500">/mo</span></div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">What you get</div>
                <ul className="space-y-4 mb-8">
                  {['Basic CRM','100 leads per month','Follow-up reminders','Basic pipeline dashboard','Analytics','1 team member'].map((f,i) => (
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
            <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium rounded-3xl p-8 relative flex flex-col border border-white/10 hover:border-white/20 hover:bg-white/[0.03] group">
              <h3 className="text-xl font-bold text-white mb-2">Growth</h3>
              <p className="text-sm text-gray-400 mb-6 min-h-[60px]">We help identify your ideal clients and optimize your outreach workflow.</p>
              <div className="mb-8"><span className="text-4xl md:text-5xl font-extrabold text-white">$199</span><span className="text-sm font-medium text-gray-400">/mo</span></div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">What you get</div>
                <ul className="space-y-4 mb-8">
                  {['AI-powered CRM dashboard','Follow-up automation','Pipeline tracking','Analytics','Team collaboration','AI lead summaries','ICP Identification Assistance','Lead sourcing guidance','Outbound workflow setup','Follow-up sequence optimization'].map((f,i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-emerald-500/70 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/signup" className="block w-full bg-white/5 hover:bg-white/10 text-white text-center py-4 rounded-xl font-bold text-sm transition-all border border-white/10 group-hover:border-white/20">Start Free Trial</a>
            </div>

            {/* Elite */}
            <div className="reveal-up opacity-0 translate-y-6 transition-all duration-700 glass-premium border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-3xl p-8 relative flex flex-col transform md:-translate-y-4 shadow-[0_0_60px_rgba(99,102,241,0.15)] hover:shadow-[0_0_80px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/50">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5 whitespace-nowrap"><span className="text-xs">⭐</span> BEST FOR SCALING AGENCIES</div>
              <h3 className="text-xl font-bold text-white mb-2">Elite</h3>
              <p className="text-sm text-indigo-200/70 mb-6 min-h-[60px]">We help agencies identify the right clients, build outbound systems, and automate follow-ups to improve conversions consistently.</p>
              <div className="mb-8"><span className="text-4xl md:text-5xl font-extrabold text-white">$249</span><span className="text-sm font-medium text-gray-400">/mo</span></div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest mb-4">Everything in Growth, plus</div>
                <ul className="space-y-4 mb-8">
                  {['Personalized ICP research','Done-with-you outbound strategy','Lead sourcing assistance','Automated follow-up system setup','Outreach workflow optimization','Priority onboarding','Advanced analytics','Higher automation limits','Dedicated support priority'].map((f,i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-100">
                      <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="/signup" className="block w-full bg-white text-black text-center py-4 rounded-xl font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]">Start Free Trial</a>
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
