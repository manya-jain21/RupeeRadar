'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { ShieldCheck, Radar } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginRoute = pathname === '/login';

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isLoginRoute) {
        router.replace('/login');
      } else if (isAuthenticated && isLoginRoute) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoading, isLoginRoute, router]);

  // If on login route, render directly without loader
  if (isLoginRoute) {
    return <>{children}</>;
  }

  // If loading auth state, show tactical radar loading screen
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-navy text-white relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute w-96 h-96 bg-blue/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-blue/40 bg-navy/80 shadow-[0_0_25px_rgba(66,116,217,0.3)]">
            <ShieldCheck size={32} className="text-blue animate-pulse" />
            <div className="absolute inset-0 rounded-full border-t border-sky animate-spin" />
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <div className="font-heading font-bold text-sm tracking-widest text-white uppercase flex items-center gap-2">
              <Radar size={16} className="text-sky animate-spin" />
              RupeeRadar Terminal
            </div>
            <p className="text-xs text-sky/70 font-mono">
              Verifying personnel authorization credentials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, wait for redirect
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
