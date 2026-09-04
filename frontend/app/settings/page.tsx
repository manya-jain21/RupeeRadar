'use client';

import { Settings, Server, RefreshCw, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <header className="flex items-center gap-3 mb-6">
        <Settings size={28} className="text-cyber-yellow" />
        <h2 className="text-xl font-bold tracking-widest uppercase">System Core</h2>
      </header>
      
      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        <div className="glass-panel p-6 rounded-xl border border-cyber-glass-border">
          <h3 className="font-bold text-cyber-blue mb-4 uppercase tracking-widest flex items-center gap-2">
            <Server size={18} /> API Status
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center pb-2 border-b border-cyber-glass-border/50">
              <span className="text-gray-400">NCRP Complaint Feed</span>
              <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-900 rounded text-xs">ONLINE</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-cyber-glass-border/50">
              <span className="text-gray-400">Overpass ATM Locator</span>
              <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-900 rounded text-xs">ONLINE</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-cyber-glass-border/50">
              <span className="text-gray-400">PostGIS Geospatial DB</span>
              <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-900 rounded text-xs">ONLINE</span>
            </li>
          </ul>
        </div>
        
        <div className="glass-panel p-6 rounded-xl border border-cyber-glass-border flex flex-col">
          <h3 className="font-bold text-cyber-pink mb-4 uppercase tracking-widest flex items-center gap-2">
            <RefreshCw size={18} /> AI Model Retraining
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            The XGBoost risk prediction model was last trained 4 hours ago. Trigger a manual retraining pipeline below.
          </p>
          <div className="mt-auto">
            <button className="w-full py-3 bg-cyber-pink/20 text-cyber-pink border border-cyber-pink rounded hover:bg-cyber-pink hover:text-white transition-all font-bold tracking-widest uppercase">
              Initiate Retrain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
