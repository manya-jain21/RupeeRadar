'use client';

import Link from 'next/link';
import { Settings, Server, RefreshCw, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col p-6 pt-24 overflow-y-auto bg-cloud min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <header className="flex items-center gap-3 mb-6">
          <Settings size={24} className="text-blue" />
          <div>
            <h2 className="font-heading text-xl font-bold text-deep">System Core</h2>
            <p className="text-xs text-slate-500 font-mono">
              Infrastructure Telemetry & Artificial Intelligence Pipelines
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Status Card */}
          <div className="panel p-6 rounded-xl bg-white shadow-sm flex flex-col">
            <h3 className="font-heading font-semibold text-deep mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Server size={18} className="text-blue" /> Telemetry Services Status
            </h3>
            <ul className="space-y-4 flex-1">
              <li className="flex justify-between items-center pb-3 border-b border-mist">
                <div>
                  <span className="text-slate-700 text-sm font-medium block">NCRP Complaint Stream</span>
                  <span className="text-[11px] text-slate-400 font-mono">Port 8000 // WebSocket Ingest</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={12} /> ONLINE
                </span>
              </li>

              <li className="flex justify-between items-center pb-3 border-b border-mist">
                <div>
                  <span className="text-slate-700 text-sm font-medium block">Overpass ATM Locator</span>
                  <span className="text-[11px] text-slate-400 font-mono">OpenStreetMap Geospatial API</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={12} /> ONLINE
                </span>
              </li>

              <li className="flex justify-between items-center pb-3 border-b border-mist">
                <div>
                  <span className="text-slate-700 text-sm font-medium block">PostGIS Geospatial DB</span>
                  <span className="text-[11px] text-slate-400 font-mono">Spatial Indexes & ATM Buffers</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={12} /> ONLINE
                </span>
              </li>
            </ul>
          </div>

          {/* AI Model Retraining Card */}
          <div className="panel p-6 rounded-xl bg-white shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-deep flex items-center gap-2 text-sm uppercase tracking-wide">
                <Cpu size={18} className="text-blue" /> AI Model Retraining
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
                v2.4 Active
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              The <strong>XGBoost Geospatial Risk Model</strong> continuously scores mule account churn and predicted cash withdrawal hotspots.
            </p>

            <div className="bg-cloud border border-mist rounded-lg p-3 mb-6 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Model Architecture:</span>
                <span className="text-slate-800 font-semibold">XGBClassifier (350 trees)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Last Pipeline Run:</span>
                <span className="text-slate-800 font-semibold">4 hours ago</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Test AUC-ROC:</span>
                <span className="text-emerald-600 font-semibold">0.964 (High Accuracy)</span>
              </div>
            </div>

            <div className="mt-auto">
              <Link
                href="/settings/retrain"
                className="w-full py-3 bg-blue text-white rounded-lg hover:bg-blue/90 transition-all font-heading font-semibold tracking-wider uppercase text-xs flex items-center justify-center gap-2 shadow-md shadow-blue/20 cursor-pointer"
              >
                <RefreshCw size={15} />
                <span>Initiate Retrain</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}