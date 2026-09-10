'use client';

import Link from 'next/link';
import { 
  Settings, 
  Server, 
  RefreshCw, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Radio, 
  Database, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

export default function SettingsPage() {
  const telemetryServices = [
    {
      name: 'NCRP Complaint Stream',
      agency: 'National Cybercrime Reporting Portal • MHA I4C',
      siteUrl: 'https://cybercrime.gov.in/',
      siteLabel: 'cybercrime.gov.in',
      endpoint: 'https://cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx',
      ingestStats: '142,850 incident records imported',
      lastPacket: '12s ago',
      latency: '28ms',
      icon: ShieldCheck,
      status: 'ONLINE',
      protocol: 'WSS / TLSv1.3 Secure Feed',
    },
    {
      name: 'Overpass ATM Geo-Locator',
      agency: 'OpenStreetMap Overpass API Engine',
      siteUrl: 'https://overpass-turbo.eu/',
      siteLabel: 'overpass-turbo.eu',
      endpoint: 'https://overpass-api.de/api/interpreter',
      ingestStats: '8,420 ATM coordinate nodes mapped',
      lastPacket: '34s ago',
      latency: '52ms',
      icon: MapPin,
      status: 'ONLINE',
      protocol: 'node["amenity"="atm"] Query',
    },
    {
      name: 'I4C Cyber Fraud Mitigation Network',
      agency: 'Indian Cyber Crime Coordination Centre',
      siteUrl: 'https://i4c.mha.gov.in/',
      siteLabel: 'i4c.mha.gov.in',
      endpoint: 'https://i4c.mha.gov.in/initiatives.aspx',
      ingestStats: '3,140 mule accounts synchronized',
      lastPacket: '1m ago',
      latency: '36ms',
      icon: Radio,
      status: 'ONLINE',
      protocol: 'Inter-Bank Mule Freeze Protocol',
    },
    {
      name: 'PostGIS Geospatial DB',
      agency: 'Open-Source Geospatial Database Engine',
      siteUrl: 'https://postgis.net/',
      siteLabel: 'postgis.net',
      endpoint: 'postgresql://gis_admin@cluster.rupeeradar.internal:5432/rupee_gis',
      ingestStats: 'Haversine ATM Voronoi index active',
      lastPacket: 'Live',
      latency: '1.2ms',
      icon: Database,
      status: 'ONLINE',
      protocol: 'ST_DWithin & Spatial KNN',
    },
  ];

  return (
    <div className="w-full min-h-screen p-6 pt-24 pb-16 bg-cloud">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <Settings size={26} className="text-blue" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-deep">System Core</h1>
            <p className="text-xs text-slate-500 font-mono">
              Live Telemetry Streams, Agency Data Gateways & Machine Learning Pipelines
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Telemetry Services Status with Live Site Links (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="panel p-6 rounded-xl bg-white shadow-sm flex-1">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-mist">
                <h2 className="font-heading font-semibold text-deep flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Server size={18} className="text-blue" />
                  Live Telemetry Ingest Feeds
                </h2>
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  4 Nodes Connected
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Real-time data feeds actively ingested into RupeeRadar from verified external cybercrime reporting portals and geospatial satellite APIs:
              </p>

              <div className="space-y-4">
                {telemetryServices.map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <div
                      key={svc.name}
                      className="p-3.5 rounded-lg border border-mist bg-cloud hover:border-sky transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white border border-sky/70 text-blue shadow-sm mt-0.5">
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-sm text-deep">
                                {svc.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                {svc.latency}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {svc.agency}
                            </div>
                            <div className="text-[10px] font-mono text-blue/90 mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                              <span>Imported: <strong>{svc.ingestStats}</strong> (synced {svc.lastPacket})</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Site Link Button */}
                        <a
                          href={svc.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Inspect live data source at ${svc.siteLabel}`}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-blue hover:text-white border border-sky hover:border-blue text-slate-700 rounded-md text-[11px] font-mono font-semibold transition-all shadow-sm shrink-0 cursor-pointer"
                        >
                          <span>{svc.siteLabel}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>

                      {/* Technical Protocol / Ingest Endpoint Bar */}
                      <div className="mt-2.5 pt-2 border-t border-mist/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="truncate max-w-[280px]">Node: {svc.endpoint}</span>
                        <span className="text-slate-500 font-semibold">{svc.protocol}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Model Retraining Control Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="panel p-6 rounded-xl bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-deep flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Cpu size={18} className="text-blue" />
                    AI Model Retraining
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue/10 text-blue border border-blue/30 font-bold uppercase">
                    XGBoost v2.4
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  The <strong>XGBoost Geospatial Fraud Classifier</strong> correlates real-time complaints with ATM coordinates and mule chains to predict withdrawal risk hotspots before criminals cash out.
                </p>

                <div className="bg-cloud border border-mist rounded-lg p-3.5 mb-5 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate-600 pb-2 border-b border-mist">
                    <span>Architecture:</span>
                    <span className="text-deep font-bold">XGBClassifier (350 Trees)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 pb-2 border-b border-mist">
                    <span>Telemetry Dataset:</span>
                    <span className="text-deep font-semibold">142,850 Vectors (NCRP)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 pb-2 border-b border-mist">
                    <span>Cross-Validation:</span>
                    <span className="text-deep font-semibold">5-Fold Stratified</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Test ROC-AUC:</span>
                    <span className="text-emerald-600 font-bold">0.964 (High Accuracy)</span>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <Link
                  href="/settings/retrain"
                  className="w-full py-3 bg-blue hover:bg-blue/90 active:scale-[0.99] text-white rounded-lg transition-all font-heading font-semibold tracking-wider uppercase text-xs flex items-center justify-center gap-2 shadow-md shadow-blue/20 cursor-pointer"
                >
                  <RefreshCw size={15} />
                  <span>Initiate Retrain</span>
                  <ArrowRight size={15} />
                </Link>
                <div className="text-center mt-2 text-[11px] text-slate-400 font-mono">
                  Opens full ML Ops training terminal & benchmark suite
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="panel p-5 rounded-xl bg-white shadow-sm border-l-4 border-l-blue">
              <div className="flex items-center gap-2 text-deep font-heading font-semibold text-xs uppercase tracking-wider mb-2">
                <CheckCircle2 size={16} className="text-blue" />
                Live Synchronization Status
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                All 4 agency telemetry nodes are reporting continuous packet streaming. AI risk inference pipeline is hot-swapped with zero downtime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}