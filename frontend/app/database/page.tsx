'use client';

import { useEffect, useState } from 'react';
import { fetchComplaints } from '../../lib/api';
import { Database, Search, Filter } from 'lucide-react';

export default function DatabasePage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      const res = await fetchComplaints();
      if (res.status === 'success') {
        setComplaints(res.data);
      }
    }
    loadData();
  }, []);

  const filtered = complaints.filter(c => 
    c.complaint_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.fraud_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database size={28} className="text-cyber-blue" />
          <h2 className="text-xl font-bold tracking-widest uppercase">Intel Database</h2>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID or Fraud Type..." 
              className="bg-cyber-dark border border-cyber-glass-border rounded-md pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyber-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-cyber-dark border border-cyber-glass-border p-2 rounded-md hover:border-cyber-blue transition-colors">
            <Filter size={20} className="text-gray-400" />
          </button>
        </div>
      </header>
      
      <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col border border-cyber-glass-border">
        <div className="overflow-auto flex-1 p-4">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-cyber-dark text-gray-400 sticky top-0 shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10">
              <tr>
                <th className="px-4 py-3 border-b border-cyber-glass-border font-bold">Complaint ID</th>
                <th className="px-4 py-3 border-b border-cyber-glass-border font-bold">Date</th>
                <th className="px-4 py-3 border-b border-cyber-glass-border font-bold">Victim Bank</th>
                <th className="px-4 py-3 border-b border-cyber-glass-border font-bold">Type</th>
                <th className="px-4 py-3 border-b border-cyber-glass-border font-bold text-right">Amount (₹)</th>
                <th className="px-4 py-3 border-b border-cyber-glass-border font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id || i} className="border-b border-cyber-glass-border/50 hover:bg-cyber-blue/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-cyber-blue">{c.complaint_id}</td>
                  <td className="px-4 py-3">{new Date(c.timestamp_reported).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{c.victim_bank}</td>
                  <td className="px-4 py-3 uppercase text-xs tracking-wider text-cyber-yellow">{c.fraud_type}</td>
                  <td className="px-4 py-3 text-right font-mono">{c.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs uppercase border ${c.status === 'frozen' ? 'border-cyber-blue text-cyber-blue' : c.status === 'withdrawn' ? 'border-cyber-pink text-cyber-pink' : 'border-gray-500 text-gray-400'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">No records found matching criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
