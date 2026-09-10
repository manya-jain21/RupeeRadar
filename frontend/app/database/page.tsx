'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchComplaints } from '../../lib/api';
import { Database, Search, Filter, X, ArrowUpDown, Download, CheckCircle2, RotateCcw } from 'lucide-react';

interface ComplaintRecord {
  id?: number | string;
  complaint_id: string;
  timestamp_reported: string;
  timestamp_fraud_occurred?: string;
  victim_bank: string;
  victim_city?: string;
  victim_state?: string;
  amount: number;
  fraud_type: string;
  mule_account_chain?: string;
  final_withdrawal_bank?: string;
  final_withdrawal_atm_lat?: number;
  final_withdrawal_atm_lon?: number;
  withdrawal_timestamp?: string | null;
  status: string;
}

export default function DatabasePage() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filter States
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFraudType, setSelectedFraudType] = useState<string>('all');
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [amountRange, setAmountRange] = useState<string>('all'); // all, under1L, 1Lto3L, above3L
  const [sortBy, setSortBy] = useState<string>('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  useEffect(() => {
    async function loadData() {
      const res = await fetchComplaints();
      if (res.status === 'success' && Array.isArray(res.data)) {
        setComplaints(res.data);
      }
    }
    loadData();
  }, []);

  // Unique options extracted dynamically from data
  const fraudTypes = useMemo(() => {
    const types = new Set<string>();
    complaints.forEach((c) => {
      if (c.fraud_type) types.add(c.fraud_type);
    });
    return Array.from(types).sort();
  }, [complaints]);

  const banks = useMemo(() => {
    const bSet = new Set<string>();
    complaints.forEach((c) => {
      if (c.victim_bank) bSet.add(c.victim_bank);
    });
    return Array.from(bSet).sort();
  }, [complaints]);

  // Counts for status pills
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: complaints.length, frozen: 0, withdrawn: 0, pending: 0 };
    complaints.forEach((c) => {
      const s = (c.status || '').toLowerCase();
      if (counts[s] !== undefined) {
        counts[s]++;
      }
    });
    return counts;
  }, [complaints]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedFraudType !== 'all') count++;
    if (selectedBank !== 'all') count++;
    if (amountRange !== 'all') count++;
    return count;
  }, [selectedStatus, selectedFraudType, selectedBank, amountRange]);

  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSelectedFraudType('all');
    setSelectedBank('all');
    setAmountRange('all');
    setSearchTerm('');
    setSortBy('date-desc');
  };

  // Filter and Sort Pipeline
  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        // Search term matching ID, Fraud Type, or Bank
        const matchesSearch =
          !searchTerm ||
          (c.complaint_id && c.complaint_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (c.fraud_type && c.fraud_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (c.victim_bank && c.victim_bank.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        // Status Filter
        if (selectedStatus !== 'all' && (c.status || '').toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }

        // Fraud Type Filter
        if (selectedFraudType !== 'all' && c.fraud_type !== selectedFraudType) {
          return false;
        }

        // Bank Filter
        if (selectedBank !== 'all' && c.victim_bank !== selectedBank) {
          return false;
        }

        // Amount Filter
        if (amountRange === 'under1L' && (c.amount || 0) >= 100000) return false;
        if (amountRange === '1Lto3L' && ((c.amount || 0) < 100000 || (c.amount || 0) > 300000)) return false;
        if (amountRange === 'above3L' && (c.amount || 0) <= 300000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.timestamp_reported).getTime() - new Date(a.timestamp_reported).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.timestamp_reported).getTime() - new Date(b.timestamp_reported).getTime();
        }
        if (sortBy === 'amount-desc') {
          return (b.amount || 0) - (a.amount || 0);
        }
        if (sortBy === 'amount-asc') {
          return (a.amount || 0) - (b.amount || 0);
        }
        return 0;
      });
  }, [complaints, searchTerm, selectedStatus, selectedFraudType, selectedBank, amountRange, sortBy]);

  // Total filtered amount
  const totalFilteredAmount = useMemo(() => {
    return filteredComplaints.reduce((acc, c) => acc + (c.amount || 0), 0);
  }, [filteredComplaints]);

  // Export filtered data as CSV
  const handleExportCSV = () => {
    if (filteredComplaints.length === 0) return;
    const headers = ['Complaint ID', 'Date Reported', 'Victim Bank', 'Fraud Type', 'Amount (INR)', 'Status'];
    const rows = filteredComplaints.map((c) => [
      c.complaint_id,
      new Date(c.timestamp_reported).toISOString(),
      c.victim_bank,
      c.fraud_type,
      c.amount,
      c.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RupeeRadar_Intel_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col p-6 pt-24 h-screen overflow-hidden bg-cloud">
      {/* Top Header & Search Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Database size={24} className="text-blue" />
          <div>
            <h2 className="font-heading text-xl font-bold text-deep">Intel Database</h2>
            <p className="text-xs text-slate-500 font-mono">
              National Cybercrime Intelligence Repository • Live Case Records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64 md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, Bank, or Fraud Type..."
              className="w-full bg-white border border-sky rounded-lg pl-9 pr-8 py-2 text-sm text-navy focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue/40 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all border cursor-pointer shadow-sm ${
              showFilterPanel || activeFiltersCount > 0
                ? 'bg-blue text-white border-blue shadow-blue/20'
                : 'bg-white text-slate-700 border-sky hover:border-blue'
            }`}
          >
            <Filter size={16} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-blue text-xs flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Export filtered records to CSV"
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-sky text-slate-700 hover:text-blue hover:border-blue rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Download size={16} />
            <span className="hidden md:inline text-xs font-semibold uppercase tracking-wider">Export CSV</span>
          </button>
        </div>
      </header>

      {/* Expandable Filter Panel */}
      {showFilterPanel && (
        <div className="bg-white border border-sky rounded-xl p-4 mb-4 shadow-md animate-fadeIn transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-mist mb-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-blue" />
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-deep">
                Telemetry Filter Matrix
              </span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Status Filter */}
            <div>
              <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Case Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'all', label: 'All', count: statusCounts.all },
                  { key: 'frozen', label: 'Frozen', count: statusCounts.frozen },
                  { key: 'withdrawn', label: 'Withdrawn', count: statusCounts.withdrawn },
                  { key: 'pending', label: 'Pending', count: statusCounts.pending },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSelectedStatus(s.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                      selectedStatus === s.key
                        ? 'bg-deep text-white border-deep shadow-sm'
                        : 'bg-cloud border-sky/70 text-slate-700 hover:border-blue'
                    }`}
                  >
                    {s.label} ({s.count || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Fraud Type Filter */}
            <div>
              <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Fraud Modus Operandi
              </label>
              <select
                value={selectedFraudType}
                onChange={(e) => setSelectedFraudType(e.target.value)}
                className="w-full bg-cloud border border-sky/80 rounded-md p-1.5 text-navy focus:outline-none focus:border-blue cursor-pointer"
              >
                <option value="all">All Fraud Types</option>
                {fraudTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Bank Filter */}
            <div>
              <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Victim Bank Node
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-cloud border border-sky/80 rounded-md p-1.5 text-navy focus:outline-none focus:border-blue cursor-pointer"
              >
                <option value="all">All Banks</option>
                {banks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Range & Sorting */}
            <div>
              <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Amount Threshold & Sort
              </label>
              <div className="flex gap-2">
                <select
                  value={amountRange}
                  onChange={(e) => setAmountRange(e.target.value)}
                  className="flex-1 bg-cloud border border-sky/80 rounded-md p-1.5 text-navy focus:outline-none focus:border-blue cursor-pointer text-xs"
                >
                  <option value="all">Any Amount</option>
                  <option value="under1L">&lt; ₹1,00,000</option>
                  <option value="1Lto3L">₹1L – ₹3,00,000</option>
                  <option value="above3L">&gt; ₹3,00,000</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 bg-cloud border border-sky/80 rounded-md p-1.5 text-navy focus:outline-none focus:border-blue cursor-pointer text-xs"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Amount: High to Low</option>
                  <option value="amount-asc">Amount: Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stat Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-mist/30 border border-mist rounded-lg mb-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-600">
            Showing <strong className="text-deep font-bold">{filteredComplaints.length}</strong> of{' '}
            {complaints.length} records
          </span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue/10 text-blue font-semibold text-[10px] uppercase">
              {activeFiltersCount} Active Filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="font-mono text-slate-600">
          Total Exposure:{' '}
          <strong className="text-deep font-bold">₹{totalFilteredAmount.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 panel rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm text-navy">
            <thead className="text-xs uppercase bg-slate-100 text-deep sticky top-0 z-10 border-b border-sky">
              <tr>
                <th className="px-4 py-3 font-semibold">Complaint ID</th>
                <th className="px-4 py-3 font-semibold">Reported Date</th>
                <th className="px-4 py-3 font-semibold">Victim Bank</th>
                <th className="px-4 py-3 font-semibold">Fraud Type</th>
                <th className="px-4 py-3 font-semibold text-right">Amount (₹)</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c, i) => (
                <tr
                  key={c.complaint_id || i}
                  className="border-b border-mist/60 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-medium text-blue">{c.complaint_id}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {c.timestamp_reported ? new Date(c.timestamp_reported).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{c.victim_bank}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-medium bg-amber/10 text-amber-700 border border-amber/30">
                      {(c.fraud_type || '').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-deep">
                    ₹{c.amount ? c.amount.toLocaleString('en-IN') : '0'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs uppercase border font-semibold ${
                        (c.status || '').toLowerCase() === 'frozen'
                          ? 'border-blue text-blue bg-blue/10'
                          : (c.status || '').toLowerCase() === 'withdrawn'
                          ? 'border-red-400 text-red-600 bg-red-50'
                          : 'border-amber-400 text-amber-600 bg-amber-50'
                      }`}
                    >
                      {(c.status || '').toLowerCase() === 'frozen' && <CheckCircle2 size={11} />}
                      {c.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter size={28} className="text-slate-300" />
                      <p className="font-heading font-medium text-slate-600">
                        No telemetry records match current filters
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-3 py-1.5 bg-blue text-white rounded-md text-xs font-semibold hover:bg-blue/90 cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}