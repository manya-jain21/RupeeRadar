'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const navItems = [
    { name: 'Overwatch', href: '/' },
    { name: 'Database', href: '/database' },
    { name: 'System', href: '/settings' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-5xl
      flex items-center justify-between px-6 py-3 rounded-full
      bg-navy/80 backdrop-blur-md border border-indigo/50 shadow-lg">
      <div className="flex items-center gap-2">
        <ShieldCheck size={22} className="text-blue" />
        <span className="font-heading font-bold text-white text-sm tracking-wide">
          RUPEE<span className="text-blue">RADAR</span>
        </span>
      </div>
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
    </nav>
  );
}