"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import axios from 'axios';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
      );
      gsap.fromTo(glowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        // Plan-based routing: if plan exists → dashboard, else → product
        if (data.user?.plan) {
          router.push('/dashboard');
        } else {
          router.push('/product');
        }
      } else {
        setError('Invalid login response. Please try again.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4 relative overflow-hidden">
      {/* Background glow */}
      <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[700px] h-[700px] bg-[#6366F1]/15 rounded-full blur-[140px]" />
      </div>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div ref={cardRef} className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center shadow-lg shadow-[#6366F1]/30 group-hover:shadow-[#6366F1]/50 transition-shadow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15.5 12H2.5L9 2Z" fill="white"/>
                <circle cx="9" cy="13.5" r="2.5" fill="white" fillOpacity="0.6"/>
              </svg>
            </div>
            <span className="text-white font-semibold tracking-tight text-sm">Pre-Closer AI</span>
          </Link>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-2xl border border-[#1F2937] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-1 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0B0F19]/60 border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all duration-200 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide uppercase">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0B0F19]/60 border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all duration-200 text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full bg-[#6366F1] hover:bg-[#5558e3] text-white rounded-xl px-4 py-3 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-[#6366F1]/20 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing In...
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-6 text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#a5b4fc] hover:text-white transition-colors font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
