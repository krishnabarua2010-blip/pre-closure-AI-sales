"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { UserPlus, Sparkles, Send } from 'lucide-react';

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    client_name: '',
    business_name: '',
    services_purchased: '',
    website: '',
    competitors: '',
    assets: '',
    notes: ''
  });
  const [summary, setSummary] = useState<any>(null);
  const [slug, setSlug] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/generate_onboarding', formData);
      setSummary(data.summary || data.onboarding_summary || data);
      if (data.slug) setSlug(data.slug);
    } catch (err: any) {
      setError('Failed to generate onboarding summary. Please verify API availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <UserPlus className="text-primary w-5 h-5" /> Client Onboarding Setup
        </h1>
        <p className="text-gray-400 mt-1 text-sm bg-primary/0 border-none">Seamlessly transition won deals into active projects with standardized AI onboarding summaries.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Form Column */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-white mb-5">Client Profile Context</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Contact Name</label>
                 <input type="text" name="client_name" required value={formData.client_name} onChange={handleChange} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors" placeholder="Alex Morgan" />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Business Name</label>
                 <input type="text" name="business_name" required value={formData.business_name} onChange={handleChange} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors" placeholder="Stripe Inc. " />
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Website</label>
                 <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors" placeholder="https://example.com" />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Services Purchased</label>
                 <input type="text" name="services_purchased" required value={formData.services_purchased} onChange={handleChange} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors" placeholder="Growth Tier - Annual" />
               </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Competitors / Market</label>
              <textarea name="competitors" rows={2} value={formData.competitors} onChange={handleChange} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="List key competitors or alternative solutions..."></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Assets & Setup</label>
              <textarea name="assets" rows={2} value={formData.assets} onChange={handleChange} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Provide link to Drive, brand kits, domain registrars, etc."></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Key Delivery Notes & Context</label>
              <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Strategic directives for the delivery team..."></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2.5 font-medium transition-all duration-200 disabled:opacity-50 mt-4 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Synthesizing Onboarding...
                </>
              ) : (
                <> <Sparkles size={16} /> Draft Onboarding Book </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
           <div className="p-4 border-b border-border bg-background/30 flex items-center justify-between">
             <h2 className="text-sm font-semibold text-white flex items-center gap-2 tracking-wide">
               <Send size={15} className="text-gray-400" /> Executive Summary
             </h2>
             {summary && (
                <button 
                  onClick={() => navigator.clipboard.writeText(typeof summary === 'string' ? summary : JSON.stringify(summary, null, 2))}
                  className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded transition-colors border border-white/5"
                >Copy Text</button>
             )}
           </div>
           
           <div className="p-6 flex-1 overflow-y-auto bg-background/10">
              {loading ? (
                 <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Generating blueprint...</p>
                 </div>
              ) : summary ? (
                 <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                   {typeof summary === 'string' ? (
                     <div className="whitespace-pre-wrap">{summary}</div>
                   ) : (
                     <pre className="mt-0 text-xs bg-black/30 p-4 border border-border rounded"><code>{JSON.stringify(summary, null, 2)}</code></pre>
                   )}
                   {slug && (
                     <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                       <p className="text-white text-sm font-semibold mb-2">Your AI Assistant is Ready!</p>
                       <div className="flex items-center gap-2">
                         <input 
                           type="text" 
                           readOnly 
                           value={`${typeof window !== 'undefined' ? window.location.origin : ''}/c/${slug}`}
                           className="flex-1 bg-black/50 border border-border rounded px-3 py-2 text-xs text-gray-300 outline-none" 
                         />
                         <button 
                           onClick={() => navigator.clipboard.writeText(`${window.location.origin}/c/${slug}`)}
                           className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded text-xs transition-colors"
                         >Copy Link</button>
                       </div>
                     </div>
                   )}
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                    <UserPlus className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-400 max-w-[250px]">Feed the pipeline parameters to output a pristine playbook for the delivery side.</p>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
