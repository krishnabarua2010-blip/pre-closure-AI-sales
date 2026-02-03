"use client";
import { useRouter } from "next/navigation";
import { createSubscription } from "@/lib/paymentsApi";
import { useState } from "react";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(plan: string) {
    setLoading(plan);
    try {
      const { subscription_id, key } = await createSubscription(plan);
      const options = {
        key,
        subscription_id,
        name: "AI Chat App",
        description: `Subscribe to the ${plan} plan`,
        handler: (response: unknown) => {
          router.push("/onboarding");
        },
        theme: { color: "#6366f1" },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Failed to start payment. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="container" style={{paddingTop:36,paddingBottom:36}}>
      <div className="stage" aria-hidden />
      <h1 style={{textAlign:'center',marginBottom:20}}>Pricing Plans</h1>

      <div className="cards" style={{gridTemplateColumns:'1fr',gap:12}}>
        <div className="glass" style={{padding:18,display:'flex',flexDirection:'column',gap:10}}>
          <div className="kicker">Basic</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8}}>
            <div style={{textDecoration:'line-through',color:'rgba(255,255,255,0.45)'}}>$29</div>
            <div style={{fontSize:22,fontWeight:800,color:'#7ee7c7'}}>$19</div>
          </div>
          <div className="muted">200 messages / month</div>
          <div className="muted">Limited usage</div>
          <button className="btn btn-primary" onClick={() => handleSubscribe('basic')} disabled={loading === 'basic'}>{loading === 'basic' ? 'Processing...' : 'Get Started'}</button>
        </div>

        <div className="glass neon-outline" style={{padding:20,display:'flex',flexDirection:'column',gap:10,position:'relative'}}>
          <div style={{position:'absolute',right:12,top:12,background:'linear-gradient(90deg,var(--accent),var(--accent-2))',color:'#061017',padding:'6px 8px',borderRadius:8,fontSize:12}}>Most Popular</div>
          <div className="kicker">Pro</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8}}>
            <div style={{textDecoration:'line-through',color:'rgba(255,255,255,0.45)'}}>$49</div>
            <div style={{fontSize:24,fontWeight:900}}>$29</div>
          </div>
          <div className="muted">1,500 messages / month</div>
          <div className="muted">Faster replies</div>
          <button className="btn btn-primary" onClick={() => handleSubscribe('pro')} disabled={loading === 'pro'}>{loading === 'pro' ? 'Processing...' : 'Get Started'}</button>
        </div>

        <div className="glass" style={{padding:18,display:'flex',flexDirection:'column',gap:10}}>
          <div style={{position:'absolute',right:12,top:12}} />
          <div className="kicker">Business</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8}}>
            <div style={{textDecoration:'line-through',color:'rgba(255,255,255,0.45)'}}>$99</div>
            <div style={{fontSize:22,fontWeight:800,color:'#8a7afe'}}>$49</div>
          </div>
          <div className="muted">Unlimited messages</div>
          <div className="muted">Priority AI</div>
          <button className="btn btn-ghost" onClick={() => handleSubscribe('business')} disabled={loading === 'business'}>{loading === 'business' ? 'Processing...' : 'Get Started'}</button>
        </div>
      </div>
    </div>
  );
}
