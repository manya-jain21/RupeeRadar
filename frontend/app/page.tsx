'use client';

import { useEffect, useState } from 'react';
import HeatMap from '../components/HeatMap';
import RiskList from '../components/RiskList';
import ComplaintFeed from '../components/ComplaintFeed';
import { fetchComplaints, fetchPredictions } from '../lib/api';
import { ShieldCheck, Radar, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [socketStatus, setSocketStatus] = useState('Connecting...');

  // Initial Data Load
  useEffect(() => {
    async function loadData() {
      try {
        const compRes = await fetchComplaints();
        if (compRes.status === 'success') setComplaints(compRes.data);
        
        const predRes = await fetchPredictions();
        if (predRes.status === 'success') setPredictions(predRes.data);
      } catch (e) {
        console.error("Failed to load initial data", e);
      }
    }
    loadData();
  }, []);

  // WebSocket for Live Data
  useEffect(() => {
    // Connect to WebSocket using env var for production, fallback for dev
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000/ws/';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setSocketStatus('LIVE');
    ws.onclose = () => setSocketStatus('DISCONNECTED');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_COMPLAINT') {
        setComplaints(prev => [data.data, ...prev].slice(0, 100) as any);
        // In a real scenario, this might trigger a re-fetch of predictions
      }
    };
    
    return () => ws.close();
  }, []);

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative w-full h-full">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-blue opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="h-16 border-b border-cyber-glass-border glass-panel flex items-center justify-between px-6 z-10 w-full shrink-0">
        <div className="flex items-center gap-3">
          <Radar size={28} className="text-cyber-blue animate-pulse" />
          <h2 className="text-lg font-bold tracking-widest text-white uppercase">
            Live Threat Map
          </h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-cyber-yellow animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-gray-400">AI Core Active</span>
          </div>
          <div className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${socketStatus === 'LIVE' ? 'border-cyber-blue text-cyber-blue glow-text' : 'border-red-500 text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${socketStatus === 'LIVE' ? 'bg-cyber-blue animate-pulse' : 'bg-red-500'}`}></span>
            {socketStatus}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-12 gap-4 p-4 z-10 min-h-0 w-full">
        
        {/* Left Column: Live Feed */}
        <div className="col-span-3 glass-panel rounded-xl flex flex-col h-full overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyber-blue/5 pointer-events-none"></div>
          <ComplaintFeed complaints={complaints} />
        </div>

        {/* Center Column: Map */}
        <div className="col-span-6 flex flex-col gap-4 h-full relative group">
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-cyber-blue via-cyber-pink to-cyber-yellow rounded-xl opacity-20 blur transition duration-1000 group-hover:opacity-40 pointer-events-none"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          ></motion.div>
          <div className="flex-1 relative rounded-xl overflow-hidden z-10">
             <HeatMap atms={[]} predictions={predictions} complaints={complaints} />
             
             {/* Map Overlay Scanner Effect */}
             <div className="absolute top-0 left-0 right-0 h-2 bg-cyber-blue/50 blur-[2px] opacity-50 z-[400]" 
                  style={{ animation: 'scan 4s linear infinite' }}>
             </div>
             <style dangerouslySetInnerHTML={{__html: `
               @keyframes scan {
                 0% { top: 0; }
                 100% { top: 100%; }
               }
             `}} />
          </div>
        </div>

        {/* Right Column: High Risk Targets */}
        <div className="col-span-3 glass-panel rounded-xl flex flex-col h-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyber-pink/5 pointer-events-none"></div>
          <RiskList predictions={predictions} />
        </div>

      </main>
    </div>
  );
}
