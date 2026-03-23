"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatPrice } from '@/lib/currencyUtils';
import CubeNetBackground from '@/components/CubeNetBackground';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: '🔍', title: 'AI Lead Qualification', description: 'Automatically qualify every prospect using a conversational AI flow. No more manual screening.' },
  { icon: '📊', title: 'Revenue Probability Scoring', description: 'Know the exact likelihood a lead converts to revenue — before you even get on a call.' },
  { icon: '⚡', title: 'Signal Detection', description: 'Detect buying intent signals from each response in real-time. Authority, urgency, budget — all tracked.' },
  { icon: '🧠', title: 'Conversation Intelligence', description: 'AI insight into what drives your best prospects to convert. Learn from every conversation.' },
  { icon: '📅', title: 'Call Booking Automation', description: 'Hot prospects book calls automatically on your calendar — zero manual follow-up required.' },
  { icon: '📋', title: 'Sales Coaching', description: 'Get real-time coaching suggestions based on conversation patterns of your top closers.' },
  { icon: '📄', title: 'Proposal Generator', description: 'Instant AI-written proposals tailored to each prospect\'s pain points and budget.' },
  { icon: '🤝', title: 'Client Onboarding AI', description: 'Automated onboarding flows once a deal closes. No dropped balls, ever.' },
  { icon: '🔄', title: 'Follow-up Automation', description: 'Smart re-engagement sequences keep warm leads warm until they\'re ready to buy.' },
  { icon: '📈', title: 'Funnel Analytics', description: 'Full funnel visibility — know exactly where leads drop off and how to fix it.' },
];

const TESTIMONIALS = [
  { quote: "This AI replaced our entire lead qualification process. We went from 2-hour demos with bad fit clients to only speaking with serious buyers.", author: "Michael R.", role: "Agency Founder", company: "GrowthForce Digital" },
  { quote: "We increased booked calls by 37% in just 3 weeks. Our sales team now only deals with hot leads.", author: "Sarah K.", role: "Growth Consultant", company: "ScaleUp Partners" },
  { quote: "The AI qualifies, scores, and books calls while I sleep. It's essentially a full-time SDR for the price of a subscription.", author: "James T.", role: "B2B SaaS Founder", company: "CloudMetrics" },
  { quote: "Our close rate went from 12% to 34% after implementing Pre-Closer. The AI filters out tire-kickers before they waste our time.", author: "Priya S.", role: "Sales Director", company: "NexGen Solutions" },
  { quote: "I was skeptical about AI handling our lead qualification, but the results speak for themselves. $2.1M pipeline in 60 days.", author: "David L.", role: "CEO", company: "Apex Consulting" },
  { quote: "The objection detection is incredible. It catches things my sales reps miss and suggests the perfect counter-argument.", author: "Amanda C.", role: "VP Sales", company: "TechBridge Inc" },
  { quote: "We replaced 3 SDRs with Pre-Closer AI and our pipeline actually improved. The ROI is insane.", author: "Marcus W.", role: "Revenue Operations", company: "DataFlow" },
  { quote: "The call booking automation alone saved us 15 hours per week. But the lead scoring is what really changed the game for us.", author: "Elena R.", role: "Founder", company: "BrandSpark Agency" },
  { quote: "Pre-Closer integrates seamlessly with our workflow. Our team adopted it in a day and saw results the same week.", author: "Ryan P.", role: "Head of Growth", company: "Velocity Labs" },
  { quote: "We've processed over 10,000 leads through Pre-Closer and our qualification accuracy is at 94%. Nothing else comes close.", author: "Jennifer M.", role: "COO", company: "SalesForge AI" },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '💬', title: 'Share Your AI Chat Link', desc: 'Add your unique AI chat link to your website, bio, email signature, or WhatsApp. Prospects start a conversation 24/7.' },
  { step: '02', icon: '🔍', title: 'AI Qualifies Every Lead', desc: 'Our AI asks strategic discovery questions — understanding budget, authority, need, and timeline in a natural conversation.' },
  { step: '03', icon: '📊', title: 'Real-Time Scoring', desc: 'Each lead gets a live revenue probability score based on buying signals, authority level, and conversion patterns.' },
  { step: '04', icon: '📅', title: 'Hot Leads Book Calls', desc: 'Qualified leads automatically book a strategy call on your calendar. You only talk to serious buyers.' },
];

const WHY_CHOOSE = [
  { title: 'Works While You Sleep', desc: 'Your AI pre-closer is active 24/7/365. Every timezone, every time. Never misses a lead.', icon: '🌙' },
  { title: 'Learns Your Sales Style', desc: 'The AI adapts to your industry, your ideal customer profile, and your unique value propositions.', icon: '🧠' },
  { title: 'No Code Required', desc: 'Set up in under 5 minutes. Just answer a few questions about your business and you\'re live.', icon: '⚡' },
  { title: 'Enterprise-Grade Security', desc: 'SOC 2 compliant. All conversations encrypted. Your data never leaves our secure infrastructure.', icon: '🔒' },
  { title: 'Integrates Everywhere', desc: 'Works with Calendly, HubSpot, Salesforce, Slack, and hundreds more via Zapier and native integrations.', icon: '🔗' },
  { title: 'Proven ROI', desc: 'Customers see an average 4.2x increase in qualified pipeline within the first 30 days.', icon: '📈' },
];

export default function ProductPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [prices, setPrices] = useState({ starter: '$99', growth: '$199', starterOld: '$199', growthOld: '$399' });

  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleStartPreview = async () => {
    try {
      setLoadingPreview(true);
      const { data } = await api.post('/auth/guest');
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_data', JSON.stringify({...data.user, isGuest: true}));
        // Send directly to the dashboard with the preview param flag enabled
        router.push('/dashboard?preview=true');
      }
    } catch (e) {
      console.error('Failed to create guest session', e);
      alert('Could not start preview right now. Please try again later.');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSimulatePlan = async () => {
    try {
      setLoadingPlan(true);
      const token = localStorage.getItem('token');
      const userDataStr = localStorage.getItem('user_data');
      if (!token || !userDataStr) {
        router.push('/signup');
        return;
      }
      
      const user = JSON.parse(userDataStr);
      await axios.post('/api/simulate_plan', { email: user.email });
      
      // Update local storage
      user.plan = 'growth';
      localStorage.setItem('user_data', JSON.stringify(user));
      
      router.push('/dashboard');
    } catch (e) {
      console.error('Failed to simulate plan', e);
      alert('Failed to simulate plan. Please ensure you are logged in.');
    } finally {
      setLoadingPlan(false);
    }
  };

  useEffect(() => {
    setPrices({
      starter: formatPrice(99),
      growth: formatPrice(199),
      starterOld: formatPrice(199),
      growthOld: formatPrice(399),
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-hero]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-stagger-item]').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 30, scale: 0.97 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', delay: i * 0.07,
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden relative z-[1]">
      <CubeNetBackground />
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
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Sign in</Link>
          <Link href="/signup" className="btn-glow text-sm bg-[#6366F1] hover:bg-[#5558e3] text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-[#6366F1]/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-36 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto" data-hero>
          <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#a5b4fc] text-xs font-medium px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#6366F1] rounded-full animate-pulse" />
            Trusted by 150+ Businesses Worldwide
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.0] mb-6">
            Meet Your AI
            <br />
            <span className="gradient-text">Sales Pre-Closer</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Qualify leads. Score revenue probability. Book calls automatically.
            Your AI works 24/7 so your team only speaks to serious buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleStartPreview} disabled={loadingPreview} className="btn-glow bg-[#6366F1] hover:bg-[#5558e3] text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-[#6366F1]/30">
              {loadingPreview ? 'Loading...' : 'Start Free Preview →'}
            </button>
            <Link href="/pricing" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white border border-[#1F2937] hover:border-[#374151] px-7 py-3.5 rounded-xl font-medium text-base transition-all">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 px-6 border-y border-[#1F2937]/40">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center" data-reveal>
          {[
            { value: '150+', label: 'Businesses Onboarded' },
            { value: '$70M+', label: 'Revenue Generated' },
            { value: '35,000+', label: 'Leads Qualified' },
            { value: '94%', label: 'Qualification Accuracy' },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-black text-[#6366F1] mb-1">{item.value}</div>
              <div className="text-xs md:text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20" data-reveal>
            <p className="text-[#6366F1] text-xs font-semibold tracking-widest uppercase mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">From prospect to booked call in 4 steps</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Set up takes 5 minutes. Results start the same day.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="absolute top-16 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent hidden md:block" />
            {HOW_IT_WORKS.map((s, i) => (
              <div key={i} data-stagger-item className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-2xl">
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

      {/* Why Choose Us */}
      <section className="py-28 px-6 bg-[#000000]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <p className="text-[#6366F1] text-xs font-semibold tracking-widest uppercase mb-4">Why Pre-Closer AI</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Built for serious sales teams</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Everything you need to turn strangers into customers, faster than ever.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((item, i) => (
              <div key={i} data-stagger-item className="feature-card bg-[#0a0a0a] border border-[#1F2937] hover:border-[#6366F1]/30 rounded-2xl p-6 group">
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <p className="text-[#6366F1] text-xs font-semibold tracking-widest uppercase mb-4">Everything Included</p>
            <h2 className="text-4xl font-black tracking-tight">The complete AI sales stack</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Every tool you need from first contact to signed deal, fully automated.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} data-stagger-item className="feature-card bg-[#0a0a0a] border border-[#1F2937] hover:border-[#6366F1]/30 rounded-2xl p-5 group">
                <span className="text-2xl block mb-3 group-hover:scale-110 transition-transform duration-300">{f.icon}</span>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6 bg-[#000000]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-reveal>
            <p className="text-[#6366F1] text-xs font-semibold tracking-widest uppercase mb-4">What Our Customers Say</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Trusted by top sales teams</h2>
            <p className="text-gray-400 mt-4">Real results from real businesses.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} data-stagger-item className="feature-card bg-[#0a0a0a] border border-[#1F2937] hover:border-[#6366F1]/20 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_,j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <blockquote className="text-sm text-gray-300 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.author}</div>
                    <div className="text-[10px] text-gray-500">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12" data-reveal>
            <p className="text-[#6366F1] text-xs font-semibold tracking-widest uppercase mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Choose your plan</h2>
            <p className="text-gray-400 mt-4">Start with a free 15-message preview, or get the full power right away.</p>
          </div>

          {/* Free Preview Banner */}
          <div className="mb-8 bg-gradient-to-r from-[#6366F1]/10 to-[#8b5cf6]/10 border border-[#6366F1]/20 rounded-2xl p-6 text-center" data-reveal>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-2xl">🎁</span>
              <h3 className="text-lg font-bold text-white">Try Pre-Closer AI for Free</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Experience all features with 15 free messages. No credit card required.</p>
            <button onClick={handleStartPreview} disabled={loadingPreview} className="btn-glow inline-block bg-[#6366F1] hover:bg-[#5558e3] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#6366F1]/30">
              {loadingPreview ? 'Initializing Workspace...' : 'Start Your Free Preview →'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6" data-reveal>
            {/* Starter */}
            <div className="feature-card bg-[#0a0a0a] border border-[#1F2937] rounded-2xl p-8">
              <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">Starter</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-white">{prices.starter}</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-600 line-through text-sm">{prices.starterOld}/month</span>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">50% off</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">Perfect for solo founders and small teams.</p>
              <ul className="space-y-2.5 mb-8">
                {['500 AI messages/month','AI lead qualification','Lead dashboard','Lead scoring','Public AI assistant link','Deal probability scoring','Basic objection tracking'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-[#6366F1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center border border-[#374151] hover:border-[#6366F1]/50 hover:bg-[#6366F1]/5 text-white py-3 rounded-xl font-semibold transition-all text-sm">
                Get Starter Plan
              </Link>
            </div>

            {/* Growth */}
            <div className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#6366F1] to-[#6366F1]/30" />
              <div className="relative bg-[#0a0a0a] rounded-2xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Growth</p>
                  <span className="text-xs bg-[#6366F1] text-white px-2.5 py-1 rounded-full font-semibold shadow-lg shadow-[#6366F1]/30">⭐ Recommended</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-black text-white">{prices.growth}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-600 line-through text-sm">{prices.growthOld}/month</span>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">50% off</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">The complete AI sales system for serious teams.</p>
                <ul className="space-y-2.5 mb-8">
                  {['Unlimited AI messages','AI revenue advisor','Lead intelligence','Proposal generator','Client onboarding AI','Call booking automation','Funnel analytics + coaching','Deal probability engine','Objection intelligence','Funnel leak detector','AI follow-up writer'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-[#6366F1] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={handleSimulatePlan} disabled={loadingPlan} className="btn-glow block w-full text-center bg-[#6366F1] hover:bg-[#5558e3] text-white py-3 rounded-xl font-bold transition-all text-sm shadow-xl shadow-[#6366F1]/30 disabled:opacity-50">
                  {loadingPlan ? 'Processing...' : 'Simulate Buy Plan →'}
                </button>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mt-8 text-center" data-reveal>
            <div className="inline-flex items-center gap-6 bg-[#0a0a0a] border border-[#1F2937] rounded-2xl px-6 py-4 text-sm text-gray-400">
              <div className="flex items-center gap-2"><span>💳</span> Cards</div>
              <div className="w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>🏦</span> UPI</div>
              <div className="w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>🔒</span> Secure</div>
              <div className="w-px h-4 bg-[#1F2937]" />
              <div className="flex items-center gap-2"><span>💸</span> Cancel anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]" />
        <div className="max-w-2xl mx-auto text-center relative z-10" data-reveal>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Ready to close more deals?
          </h2>
          <p className="text-gray-400 mb-8">Start with 15 free messages. No credit card required.</p>
          <button onClick={handleStartPreview} disabled={loadingPreview} className="btn-glow inline-block bg-[#6366F1] hover:bg-[#5558e3] text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-[#6366F1]/30">
            Start Your Free Preview →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F2937] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#6366F1] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
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
          </div>
          <p className="text-xs text-gray-700">© 2025 Pre-Closer AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
