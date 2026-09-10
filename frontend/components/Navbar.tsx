'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // Hide navigation entirely on login page
  if (pathname === '/login') {
    return null;
  }

  const navItems = [
    { name: 'Overwatch', href: '/' },
    { name: 'Database', href: '/database' },
    { name: 'System', href: '/settings' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-5xl
      flex items-center justify-between px-6 py-3 rounded-full
      bg-navy/80 backdrop-blur-md border border-indigo/50 shadow-lg transition-all">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <ShieldCheck size={22} className="text-blue" />
        <span className="font-heading font-bold text-white text-sm tracking-wide">
          RUPEE<span className="text-blue">RADAR</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors
              ${pathname === item.href ? 'text-blue' : 'text-slate-400 hover:text-white'}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Authenticated Personnel Badge & Sign Out */}
      <div className="flex items-center gap-3">
        {isAuthenticated && user && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-indigo/60 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-heading font-medium text-white text-[11px] uppercase tracking-wide">
              {user.username}
            </span>
            <span className="text-[10px] font-mono text-sky/80 bg-blue/10 px-1.5 py-0.5 rounded">
              {user.badgeId}
            </span>
          </div>
        )}

        {isAuthenticated && (
          <button
            onClick={logout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-full border border-indigo/40 hover:border-red-500/30 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </nav>
  );
}