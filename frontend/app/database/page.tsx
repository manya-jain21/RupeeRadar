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
    <div className="flex-1 flex flex-col p-6 pt-28 overflow-hidden bg-cloud">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database size={24} className="text-blue" />
          <h2 className="font-heading text-xl font-bold text-deep">Intel Database</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID or Fraud Type..."
              className="bg-white border border-sky rounded-md pl-9 pr-4 py-2 text-sm text-navy focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white border border-sky p-2 rounded-md hover:border-blue transition-colors">
            <Filter size={18} className="text-slate-500" />
          </button>
        </div>
      </header>

      <div className="flex-1 panel rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm text-navy">
            <thead className="text-xs uppercase bg-ice text-deep sticky top-0 z-10 border-b border-sky">
              <tr>
                <th className="px-4 py-3 font-semibold">Complaint ID</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Victim Bank</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold text-right">Amount (₹)</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id || i} className="border-b border-ice hover:bg-ice/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-blue">{c.complaint_id}</td>
                  <td className="px-4 py-3">{new Date(c.timestamp_reported).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{c.victim_bank}</td>
                  <td className="px-4 py-3 uppercase text-xs tracking-wide text-amber-600">{c.fraud_type}</td>
                  <td className="px-4 py-3 text-right font-mono">{c.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs uppercase border font-medium
                      ${c.status === 'frozen' ? 'border-blue text-blue bg-ice'
                        : c.status === 'withdrawn' ? 'border-red-400 text-red-500 bg-red-50'
                        : 'border-slate-300 text-slate-500 bg-slate-50'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">No records found matching criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}