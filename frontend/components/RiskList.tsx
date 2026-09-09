'use client';

import { MapPin, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RiskList({ predictions }: { predictions: any[] }) {
  if (!predictions || predictions.length === 0) {
    return <div className="text-slate-400 text-sm p-4">Scanning predictive models...</div>;
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full w-full bg-navy">
      <h3 className="text-amber-400 font-heading font-semibold uppercase text-xs tracking-widest flex items-center gap-2">
        <AlertTriangle size={14} className="shrink-0" />
        High Risk Targets
      </h3>
      <AnimatePresence>
        {predictions.map((pred, idx) => (
          <motion.div
            key={pred.atm_id || idx}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-slate-900 border border-indigo p-3 rounded-md relative group shrink-0"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500 rounded-r"></div>

            <div className="pl-3 flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-semibold text-white text-sm break-words leading-tight">{pred.bank} ATM</h4>
                <div className="flex items-start gap-1 text-[10px] text-slate-400 mt-1">
                  <MapPin size={10} className="text-teal shrink-0 mt-[2px]" />
                  <span className="break-words">Lat: {pred.lat.toFixed(4)}<br/>Lon: {pred.lon.toFixed(4)}</span>
                </div>
                <div className="text-xs text-amber-400 mt-1">ETA: {pred.predicted_time_window}</div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Risk Score</span>
                <span className={`font-mono font-bold text-lg ${pred.risk_score > 90 ? 'text-amber-500' : 'text-blue'}`}>
                  {pred.risk_score}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}