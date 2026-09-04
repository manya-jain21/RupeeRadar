'use client';

import { ShieldAlert, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComplaintFeed({ complaints }: { complaints: any[] }) {
  if (!complaints || complaints.length === 0) {
    return <div className="text-gray-400 text-sm animate-pulse p-4">Awaiting data stream...</div>;
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full hide-scrollbar">
      <h3 className="text-cyber-blue font-bold uppercase text-sm tracking-widest flex items-center gap-2 sticky top-0 bg-cyber-glass p-2 z-10 backdrop-blur-md">
        <Activity size={16} className="animate-pulse" />
        Live Intercepts
      </h3>
      <AnimatePresence>
        {complaints.map((comp, idx) => (
          <motion.div 
            key={comp.complaint_id || idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 border border-slate-700 p-3 rounded text-sm hover:border-cyber-blue transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-xs text-gray-400">{comp.complaint_id}</span>
              <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded border border-red-900 uppercase">
                {comp.fraud_type}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={14} className="text-cyber-blue" />
              <span className="text-gray-200">₹{comp.amount?.toLocaleString()}</span>
            </div>
            
            <div className="text-xs text-gray-500 font-mono break-all line-clamp-1">
              CHAIN: {comp.mule_account_chain}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
