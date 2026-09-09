'use client';

import { ShieldAlert, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComplaintFeed({ complaints }: { complaints: any[] }) {
  if (!complaints || complaints.length === 0) {
    return <div className="text-slate-400 text-sm p-4">Awaiting data stream...</div>;
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full hide-scrollbar bg-navy">
      <h3 className="text-teal font-heading font-semibold uppercase text-xs tracking-widest flex items-center gap-2 sticky top-0 bg-navy p-2 z-10">
        <Activity size={14} />
        Live Intercepts
      </h3>
      <AnimatePresence>
        {complaints.map((comp, idx) => (
          <motion.div
            key={comp.complaint_id || idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 border border-indigo p-3 rounded text-sm hover:border-teal transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-xs text-slate-400">{comp.complaint_id}</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                {comp.fraud_type}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={14} className="text-teal" />
              <span className="text-slate-200">₹{comp.amount?.toLocaleString()}</span>
            </div>

            <div className="text-xs text-slate-500 font-mono break-all line-clamp-1">
              CHAIN: {comp.mule_account_chain}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}