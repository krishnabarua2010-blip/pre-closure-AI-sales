"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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
    const spacing = 100;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.003; 
      
      const points = [];
      const offsetY = canvas.height * 0.15; 
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i - cols/2) * spacing;
          const y = (j - rows/2) * spacing;
          
          const z = Math.sin(i * 0.2 + time) * 60 + Math.cos(j * 0.2 + time * 1.5) * 60;
          const angleX = Math.PI / 2.5;
          const angleZ = time * 0.1;
          
          const x1 = x * Math.cos(angleZ) - y * Math.sin(angleZ);
          const y1 = x * Math.sin(angleZ) + y * Math.cos(angleZ);
          const y2 = y1 * Math.cos(angleX) - z * Math.sin(angleX);
          const z2 = y1 * Math.sin(angleX) + z * Math.cos(angleX);
          
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
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          const p = points[idx];
          
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

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);

  // Full 1-minute demo simulation exactly showing how the product works
  useEffect(() => {
    if (!isPlaying) return;

    let currentStep = 0;
    let elapsed = 0;
    
    const intervals = [
      2000,  // 0 -> 1: Lead "Hi, looking for agency software"
      3000,  // 1 -> 2: AI "Hi! We can definitely help. About how many leads do you process monthly?"
      3000,  // 2 -> 3: Lead "Around 50-100 per month right now."
      4000,  // 3 -> 4: AI "Perfect. I've logged your requirements..." -> Dashboard adds lead as Unknown Prospect
      4000,  // 4 -> 5: Dashboard AI Scoring -> Upgrades to High Intent Qualified Lead
      5000,  // 5 -> 6: AI sends WhatsApp follow up automatically
      5000,  // 6 -> 7: Lead replies on WhatsApp "Thanks! Let's book a demo."
      6000,  // 7 -> 8: Deal moves to In Discussion -> Deal Won!
      8000,  // 8 -> 0: Loop completes
    ];
    let timeoutId: NodeJS.Timeout;

    const runSequence = () => {
      timeoutId = setTimeout(() => {
        currentStep++;
        if (currentStep > 8) {
           setIsPlaying(false);
           return;
        }
        setStep(currentStep);
        runSequence();
      }, intervals[currentStep % intervals.length]);
    };

    runSequence();
    
    // Progress timer
    const progressId = setInterval(() => {
       setTimer(prev => {
          if (prev >= 60) return 60; // Max 60 seconds
          return prev + 1;
       });
    }, 1000);

    return () => {
        clearTimeout(timeoutId);
        clearInterval(progressId);
    };
  }, [isPlaying]);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden relative font-sans">
      <GreyMeshBackground />
      
      {/* Top Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050505]/50 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M9 2L15.5 12H2.5L9 2Z" fill="white" fillOpacity="0.9"/></svg>
          </div>
          <span className="text-sm font-bold text-gray-100">Pre Closer</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Back to Home</Link>
          <a href="/signup" className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">Start Free Trial</a>
        </div>
      </nav>

      {/* Main Fullscreen Demo Layout */}
      <div className="flex-1 mt-[70px] relative z-10 flex flex-col p-4 md:p-8">
         
         {!isPlaying && step === 0 && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
               <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_50px_rgba(99,102,241,0.5)]" onClick={() => setIsPlaying(true)}>
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               </div>
               <h2 className="mt-6 text-3xl font-extrabold text-white">Watch The 1-Minute Demo</h2>
               <p className="text-gray-400 mt-2 max-w-md text-center">See exactly how our AI agent interacts with your leads, qualifies them, and updates your pipeline in real-time.</p>
            </div>
         )}

         <style jsx>{`
            @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
            }
            .animate-slide-up {
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 15px rgba(99,102,241,0.2); }
            50% { box-shadow: 0 0 25px rgba(99,102,241,0.5); }
            }
            .animate-pulse-glow {
            animation: pulseGlow 2s infinite;
            }
         `}</style>
         
         <div className="w-full h-full max-w-7xl mx-auto bg-[#030303]/80 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            
            {/* Left: Chat Widget Simulation */}
            <div className="w-full md:w-5/12 bg-[#080808]/90 border-b md:border-b-0 md:border-r border-white/10 flex flex-col relative z-10 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
               <div className="p-5 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                     <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  </div>
                  <div>
                     <div className="text-gray-100 font-bold text-sm tracking-wide">Pre Closer AI</div>
                     <div className="text-emerald-400 text-xs flex items-center gap-1.5 font-bold mt-0.5 uppercase tracking-wider">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        Active Agent
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 p-6 space-y-6 overflow-y-auto relative custom-scrollbar flex flex-col justify-end pb-8">
                  <div className="text-center text-[10px] text-gray-600 mb-2 uppercase tracking-widest font-bold">Live Interaction Started</div>
                  
                  {step >= 1 && (
                     <div className="bg-white/10 text-gray-100 p-4 rounded-2xl rounded-tr-none ml-auto max-w-[85%] text-sm shadow-xl border border-white/5 animate-slide-up">
                     Hi, I'm looking for a system to manage my agency's leads.
                     </div>
                  )}
                  {step >= 2 && (
                     <div className="bg-indigo-500/10 text-indigo-100 p-4 rounded-2xl rounded-tl-none mr-auto max-w-[85%] text-sm shadow-xl border border-indigo-500/30 animate-slide-up backdrop-blur-md">
                     Hello! We can definitely help. About how many leads do you process monthly?
                     </div>
                  )}
                  {step >= 3 && (
                     <div className="bg-white/10 text-gray-100 p-4 rounded-2xl rounded-tr-none ml-auto max-w-[85%] text-sm shadow-xl border border-white/5 animate-slide-up">
                     Around 50-100 per month right now.
                     </div>
                  )}
                  {step >= 4 && (
                     <div className="bg-indigo-500/10 text-indigo-100 p-4 rounded-2xl rounded-tl-none mr-auto max-w-[85%] text-sm shadow-xl border border-indigo-500/30 animate-slide-up backdrop-blur-md">
                     Perfect. I've logged your requirements. Our platform is ideal for that volume!
                     </div>
                  )}
                  {step >= 6 && (
                     <div className="bg-emerald-500/10 text-emerald-100 p-5 rounded-2xl rounded-tl-none mr-auto max-w-[95%] text-sm shadow-xl border border-emerald-500/40 animate-slide-up mt-8 relative overflow-hidden backdrop-blur-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-50" />
                        <div className="relative z-10">
                           <div className="text-[10px] text-emerald-400 mb-3 font-bold flex items-center gap-2 uppercase tracking-widest">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                              WhatsApp Auto-Pilot Triggered
                           </div>
                           Hey! Just checking in to see if you'd like to book a quick demo with our team?
                        </div>
                     </div>
                  )}
                  {step >= 7 && (
                     <div className="bg-white/10 text-gray-100 p-4 rounded-2xl rounded-tr-none ml-auto max-w-[85%] text-sm shadow-xl border border-white/5 animate-slide-up mt-4 relative">
                        <div className="absolute -top-3 right-2 text-[10px] text-gray-400 bg-[#121212] px-2 rounded-full border border-white/10">WhatsApp Reply</div>
                        Thanks! Let's book a demo for tomorrow.
                     </div>
                  )}
               </div>
            </div>

            {/* Right: Dashboard Simulation */}
            <div className="flex-1 bg-transparent p-6 md:p-10 relative flex flex-col overflow-y-auto">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.01] to-transparent pointer-events-none" />
               <div className="flex justify-between items-center mb-8 relative z-10">
                  <div>
                     <h3 className="text-white font-extrabold text-2xl md:text-3xl flex items-center gap-4">
                     Live Pipeline 
                     <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs px-3 py-1 rounded-md font-bold uppercase tracking-widest animate-pulse">Real-time Tracker</span>
                     </h3>
                     <p className="text-gray-400 text-sm mt-2">See exactly how AI scores and moves your leads automatically.</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 relative z-10">
                  {/* New Leads Column */}
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 flex flex-col gap-5 shadow-2xl backdrop-blur-sm">
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="text-gray-300 text-xs font-extrabold uppercase tracking-widest flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-blue-500" /> New Leads
                        </h4>
                        <span className="bg-white/10 text-gray-200 text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold">{step >= 4 && step < 5 ? '2' : '1'}</span>
                     </div>
                     
                     <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 opacity-60">
                        <div className="text-gray-200 text-base font-bold">Mike T.</div>
                        <div className="text-gray-400 text-xs mt-1.5 font-medium">SaaS Founder</div>
                     </div>

                     {step >= 4 && step < 5 && (
                        <div className="bg-indigo-500/10 border border-indigo-500/40 rounded-2xl p-5 animate-slide-up relative overflow-hidden animate-pulse-glow">
                           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" />
                           <div className="flex justify-between items-start pl-2">
                              <div className="text-white text-base font-bold">Unknown Prospect</div>
                              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">Evaluating</span>
                           </div>
                           <div className="text-indigo-200/70 text-xs mt-2.5 pl-2 font-medium">Needs system for 50-100 leads/mo</div>
                           <div className="mt-5 pl-2 text-xs text-indigo-300 flex items-center gap-2 font-bold bg-indigo-500/20 py-2 px-3 rounded-lg w-fit">
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              AI Scoring & Qualifying...
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Qualified Column */}
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 flex flex-col gap-5 shadow-2xl backdrop-blur-sm">
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="text-gray-300 text-xs font-extrabold uppercase tracking-widest flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500" /> Qualified
                        </h4>
                        <span className="bg-white/10 text-gray-200 text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold">{step >= 5 ? '2' : '1'}</span>
                     </div>

                     <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 opacity-60">
                        <div className="text-gray-200 text-base font-bold">Sarah Jenkins</div>
                        <div className="text-gray-400 text-xs mt-1.5 font-medium">Design Agency • Score: 85</div>
                     </div>

                     {step >= 5 && step < 8 && (
                        <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-slide-up relative overflow-hidden">
                           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                           <div className="flex justify-between items-start pl-2">
                              <div className="text-white text-base font-bold">Agency Prospect</div>
                              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-1 rounded font-extrabold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">High Intent</span>
                           </div>
                           <div className="text-emerald-100/70 text-xs mt-2.5 pl-2 font-medium">AI Score: 96/100 • 50-100 leads</div>
                           
                           {step >= 6 && (
                              <div className="mt-5 pl-2 text-[11px] text-emerald-400 flex items-center gap-2 border-t border-emerald-500/20 pt-4 font-bold uppercase tracking-wide">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                                 WhatsApp Auto-Pilot Sent
                              </div>
                           )}
                           {step >= 7 && (
                              <div className="mt-3 pl-2 text-[11px] text-indigo-300 flex items-center gap-2 font-bold uppercase tracking-wide bg-indigo-500/20 px-3 py-2 rounded-lg">
                                 <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                                 Reply Received! Moving to Discussion
                              </div>
                           )}
                        </div>
                     )}
                  </div>

                  {/* In Discussion Column */}
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-6 flex-col gap-5 shadow-2xl backdrop-blur-sm hidden md:flex">
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="text-gray-300 text-xs font-extrabold uppercase tracking-widest flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-yellow-500" /> In Discussion
                        </h4>
                        <span className="bg-white/10 text-gray-200 text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold">{step >= 8 ? '2' : '1'}</span>
                     </div>
                     
                     <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 opacity-60">
                        <div className="flex justify-between items-center">
                           <div className="text-gray-200 text-base font-bold">David R.</div>
                           <div className="text-yellow-500 text-xs font-bold bg-yellow-500/20 px-2 py-1 rounded">Meeting Set</div>
                        </div>
                        <div className="text-gray-400 text-xs mt-1.5 font-medium">Awaiting Demo</div>
                     </div>

                     {step >= 8 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-2xl p-5 shadow-[0_0_30px_rgba(234,179,8,0.15)] animate-slide-up relative overflow-hidden">
                           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                           <div className="flex justify-between items-start pl-2">
                              <div className="text-white text-base font-bold">Agency Prospect</div>
                              <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2.5 py-1 rounded font-extrabold tracking-widest uppercase">Meeting Booked</span>
                           </div>
                           <div className="text-yellow-200/70 text-xs mt-2.5 pl-2 font-medium">Demo Scheduled for Tomorrow</div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
