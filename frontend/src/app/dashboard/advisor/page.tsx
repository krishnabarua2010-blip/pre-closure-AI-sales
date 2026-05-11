"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { Activity, Zap, TrendingUp, Sparkles } from 'lucide-react';

export default function AdvisorPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/advisor_analysis', {});
      setAnalysis(data);
    } catch (err: any) {
      setError('Failed to generate advisor analysis. Ensure pipeline data exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="text-primary w-5 h-5" /> AI Advisor
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Actionable pipeline intelligence to eliminate bottlenecks and scale revenue.</p>
        </div>
        <button
          onClick={generateAnalysis}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-50 text-sm h-10 min-w-[140px] flex items-center justify-center gap-2"
        >
          {loading ? (
             <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
             </>
          ) : 'Run Analysis'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
           <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
           {error}
        </div>
      )}

      {analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20"><Activity size={18} /></div>
               <h2 className="text-base font-semibold text-white">Funnel Leakage</h2>
             </div>
             <div className="text-sm text-gray-300 space-y-4">
                {Array.isArray(analysis.funnel_problems) 
                  ? analysis.funnel_problems.map((p: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start bg-white/[0.02] p-3 rounded-lg border border-white/5">
                        <span className="text-red-500 mt-0.5 shrink-0">•</span>
                        <span className="leading-relaxed">{p}</span>
                      </div>
                    ))
                  : <div className="bg-white/[0.02] p-4 rounded-lg border border-white/5 text-gray-400 italic">{analysis.funnel_problems || 'No major issues detected.'}</div>}
             </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20"><Zap size={18} /></div>
               <h2 className="text-base font-semibold text-white">Strategic Prescriptions</h2>
             </div>
             <div className="text-sm text-gray-300 space-y-4">
                {Array.isArray(analysis.recommendations) 
                  ? analysis.recommendations.map((p: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start bg-primary/[0.02] p-3 rounded-lg border border-primary/10">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span className="leading-relaxed">{p}</span>
                      </div>
                    ))
                  : <div className="bg-primary/[0.02] p-4 rounded-lg border border-primary/10 text-gray-400 italic">{analysis.recommendations || analysis.ai_recommendations || 'Run again for exact recommendations.'}</div>}
             </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20"><TrendingUp size={18} /></div>
               <h2 className="text-base font-semibold text-white">Revenue Impact Matrix</h2>
             </div>
             <div className="text-sm text-gray-300 space-y-4">
                {Array.isArray(analysis.revenue_improvement_suggestions) 
                  ? analysis.revenue_improvement_suggestions.map((p: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start bg-emerald-500/[0.02] p-3 rounded-lg border border-emerald-500/10">
                        <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                        <span className="leading-relaxed">{p}</span>
                      </div>
                    ))
                  : <div className="bg-emerald-500/[0.02] p-4 rounded-lg border border-emerald-500/10 text-gray-400 italic">{analysis.revenue_improvement_suggestions || 'No specific improvements modeled.'}</div>}
             </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-2xl bg-card/10">
            <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="text-primary w-8 h-8 opacity-40" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Initialize Advisor Engine</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Generate a comprehensive AI-driven report to uncover operational bottlenecks, script flaws, and scale your active revenue mathematically.
            </p>
          </div>
        )
      )}
    </div>
  );
}
