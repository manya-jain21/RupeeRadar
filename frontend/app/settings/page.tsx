'use client';

import { Settings, Server, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden bg-cloud">
      <header className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-blue" />
        <h2 className="font-heading text-xl font-bold text-deep">System Core</h2>
      </header>

      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        <div className="panel p-6 rounded-xl">
          <h3 className="font-heading font-semibold text-deep mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Server size={18} /> API Status
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center pb-3 border-b border-mist">
              <span className="text-slate-500 text-sm">NCRP Complaint Feed</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs font-medium">ONLINE</span>
            </li>
            <li className="flex justify-between items-center pb-3 border-b border-mist">
              <span className="text-slate-500 text-sm">Overpass ATM Locator</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs font-medium">ONLINE</span>
            </li>
            <li className="flex justify-between items-center pb-3 border-b border-mist">
              <span className="text-slate-500 text-sm">PostGIS Geospatial DB</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs font-medium">ONLINE</span>
            </li>
          </ul>
        </div>

        <div className="panel p-6 rounded-xl flex flex-col">
          <h3 className="font-heading font-semibold text-deep mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
            <RefreshCw size={18} /> AI Model Retraining
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            The XGBoost risk prediction model was last trained 4 hours ago. Trigger a manual retraining pipeline below.
          </p>
          <div className="mt-auto">
            <button className="w-full py-3 bg-blue/10 text-blue border border-blue rounded-md hover:bg-blue hover:text-white transition-colors font-semibold tracking-wide uppercase text-sm">
              Initiate Retrain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}