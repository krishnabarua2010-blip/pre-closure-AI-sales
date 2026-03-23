"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Search } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await api.get('/get_leads');
        setLeads(data?.leads || data || []);
      } catch (err: any) {
        setError('Failed to load leads from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fade-in-0 slide-in-from-bottom-[10px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Leads Engine</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage and analyze your highest value prospects.</p>
        </div>
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
           <input 
             type="text" 
             placeholder="Search prospects..." 
             className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
           />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-pulse flex space-x-2">
             <div className="w-2.5 h-2.5 bg-primary/40 rounded-full"></div>
             <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animation-delay-200"></div>
             <div className="w-2.5 h-2.5 bg-primary rounded-full animation-delay-400"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          {error}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 text-gray-500 text-xs uppercase tracking-wider border-b border-border">
                  <th className="px-5 py-3 font-medium">Lead Info</th>
                  <th className="px-5 py-3 font-medium">Readiness</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Summary</th>
                  <th className="px-5 py-3 font-medium text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {leads.map((lead: any, i: number) => (
                  <tr 
                    key={i} 
                    onClick={() => router.push(`/leads/${lead.id || i}`)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-sm text-gray-200 group-hover:text-primary transition-colors">{lead.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{lead.email || lead.email_address || '-'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400">{lead.readiness_level || 'Evaluating'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                        {lead.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-400 max-w-xs truncate">{lead.summary || 'No summary available...'}</div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex bg-background border border-border rounded px-2 py-1 text-xs font-semibold text-gray-300 shadow-sm">
                        {lead.lead_score || lead.score || 0}
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-500 text-sm">
                      No leads found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
