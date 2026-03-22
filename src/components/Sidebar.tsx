"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
  ) },
  { href: '/leads', label: 'Leads', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  ) },
  { href: '/advisor', label: 'Advisor', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
  ) },
  { href: '/proposals', label: 'Proposals', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
  ) },
  { href: '/onboarding', label: 'Onboarding', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
  ) },
  { href: '/settings', label: 'Settings', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  ) },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-60 h-screen bg-[#0d1117] border-r border-[#1F2937] flex-col hidden md:flex sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#1F2937]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center shadow-lg shadow-[#6366F1]/30 group-hover:shadow-[#6366F1]/50 transition-shadow">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 12H2.5L9 2Z" fill="white"/>
              <circle cx="9" cy="13.5" r="2.5" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight leading-none">Pre-Closer</h2>
            <p className="text-[10px] text-gray-600 mt-0.5">AI Sales Platform</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2 mt-1">Main</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#6366F1]/12 text-[#a5b4fc] border-l-2 border-[#6366F1]'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/4'
              }`}
            >
              <span className={`transition-colors ${isActive ? 'text-[#6366F1]' : 'text-gray-600 group-hover:text-gray-400'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Plan Badge */}
      <div className="mx-3 mb-3 bg-[#6366F1]/8 border border-[#6366F1]/15 rounded-xl p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-[#a5b4fc] tracking-wide uppercase">Beta Plan</span>
          <span className="text-[9px] bg-[#6366F1]/20 text-[#a5b4fc] px-1.5 py-0.5 rounded-full">Active</span>
        </div>
        <div className="w-full h-1 bg-[#1F2937] rounded-full overflow-hidden">
          <div className="h-full bg-[#6366F1] rounded-full" style={{ width: '45%' }} />
        </div>
        <p className="text-[10px] text-gray-600 mt-1.5">225 / 500 messages used</p>
      </div>

      {/* Sign out */}
      <div className="p-3 border-t border-[#1F2937]">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full px-3 py-2.5 text-sm text-gray-500 hover:text-gray-200 hover:bg-white/4 rounded-xl transition-all duration-150 text-left flex gap-3 items-center"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
