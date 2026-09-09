'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, LayoutDashboard, Database, Network, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overwatch Map', href: '/', icon: LayoutDashboard },
    { name: 'Intel Database', href: '/database', icon: Database },
    { name: 'Money Trail Graph', href: '/network', icon: Network },
    { name: 'System Core', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full border-r border-cyber-glass-border glass-panel flex flex-col z-50">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-cyber-glass-border">
        <ShieldAlert size={28} className="text-cyber-pink animate-pulse" />
        <h1 className="text-xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue to-cyber-pink uppercase glow-text">
          RUPEERADAR
        </h1>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 relative group overflow-hidden
                ${isActive ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-blue shadow-[0_0_10px_#00f0ff]"></div>
              )}
              <Icon size={18} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-bold text-sm tracking-wider uppercase">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-cyber-glass-border text-xs text-gray-500 font-mono text-center">
        v1.0.0-SIH-BUILD
      </div>
    </aside>
  );
}
