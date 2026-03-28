"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { trackEvent } from '@/lib/tracking';

export default function OnboardingPage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    trackEvent('onboarding_started');
    gsap.fromTo('.reveal',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15 }
    );
  }, []);

  const handleCopy = () => {
    trackEvent('script_copied');
    navigator.clipboard.writeText('<script src="https://custom.precloser.ai/script.js" defer></script>');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-6 relative z-[1] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl w-full relative z-10 glass bg-[#111827]/80 backdrop-blur-xl border border-[#1F2937] rounded-3xl p-10 shadow-2xl">
        <div className="text-center mb-10 reveal">
          <div className="w-16 h-16 bg-[#6366F1]/20 rounded-2xl border border-[#6366F1]/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-3">Let’s activate this on your website</h1>
          <p className="text-gray-400">Your AI sales floor is ready. Let's start capturing leads immediately.</p>
        </div>

        <div className="space-y-8 reveal">
          {/* Method 1: Easy Setup */}
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Option 1: Quick Install</h3>
            <div className="flex gap-3">
              <input 
                type="url" 
                placeholder="https://yourwebsite.com" 
                className="flex-1 bg-[#111827] border border-[#374151] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6366F1] transition-colors text-white"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-[#6366F1] hover:bg-[#5558e3] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
              >
                Connect
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">We'll scan your site and auto-inject the agent if you're using Wix, Webflow, or WordPress.</p>
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#1F2937]" />
            <div className="relative flex justify-center">
              <span className="bg-[#111827] px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">or</span>
            </div>
          </div>

          {/* Method 2: Manual snippet */}
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Option 2: Add to HTML</h3>
              <button onClick={handleCopy} className="text-xs font-medium text-[#6366F1] hover:text-[#a5b4fc] transition-colors flex items-center gap-1">
                {copied ? '✓ Copied' : '📋 Copy code'}
              </button>
            </div>
            <pre className="bg-[#000000] border border-[#1F2937] p-4 rounded-xl text-xs text-gray-300 font-mono overflow-x-auto">
              {`<script src="https://custom.precloser.ai/script.js" defer></script>`}
            </pre>
            <p className="text-xs text-gray-500 mt-4">Paste this snippet into the <code className="text-gray-400 bg-[#111827] px-1 rounded">&lt;head&gt;</code> of your website index file.</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1F2937] text-center reveal">
          <button onClick={() => router.push('/dashboard')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Skip for now, take me to dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
