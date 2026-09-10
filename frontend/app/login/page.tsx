'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import { ShieldCheck, Lock, User, ShieldAlert, ArrowRight } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const { login, isAuthenticated } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(identifier, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectPath);
    } else {
      setError(result.error || 'Authentication denied.');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* High-tech radial mesh glow & grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(66,116,217,0.25),rgba(15,23,42,0))]" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#95CCDD 1px, transparent 1px), linear-gradient(to right, #95CCDD 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Terminal Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top Header pill */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy/90 border border-indigo text-[11px] font-mono tracking-widest text-sky uppercase shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Terminal 01 // Secure Node Active</span>
          </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle accent bar at top of card */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-deep via-blue to-sky" />

          {/* Platform Branding */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue/10 border border-blue/40 mb-3 shadow-[0_0_20px_rgba(66,116,217,0.25)]">
              <ShieldCheck size={32} className="text-blue" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-white tracking-wider flex items-center justify-center gap-1.5">
              RUPEE<span className="text-blue">RADAR</span>
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">
              Restricted Intelligence Portal
            </p>
            <div className="mt-2.5 text-[11px] text-amber font-medium bg-amber/10 border border-amber/30 rounded-md py-1 px-3 inline-block">
              Authorized Personnel Access Only
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/50 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-start gap-2.5 animate-shake">
              <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-mono leading-relaxed">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Personnel ID / Handle
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter personnel ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950/70 border border-indigo text-white text-sm rounded-lg pl-10 pr-4 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Security Access Key
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter security key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/70 border border-indigo text-white text-sm rounded-lg pl-10 pr-4 py-2.5 placeholder:text-slate-600 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 bg-blue hover:bg-blue/90 active:scale-[0.99] text-white font-heading font-semibold text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-blue/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Clearance...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Terminal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Compliance Footer */}
        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            National Cybercrime Reporting Portal • Node Security Protocol
          </p>
          <p className="text-[10px] text-slate-600 font-mono mt-0.5">
            Strictly for authorized law enforcement operators. All connections are logged.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
