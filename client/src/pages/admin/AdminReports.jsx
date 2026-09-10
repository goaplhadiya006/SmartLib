import React, { useState, useEffect } from 'react';
import { BarChart3, Printer, Download, BookOpen, Users, BookmarkCheck, CheckCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../services/api';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/borrow/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to load report stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner text="Generating library reports..." />;
  if (!stats) return <p className="text-center py-10">Report unavailable.</p>;

  const { summary, categoryStats, popularBooks } = stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" /> Executive Library Analytics Report
          </h1>
          <p className="text-xs text-slate-500">Official library inventory, utilization metrics, and borrowing audit.</p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors self-start print:hidden"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF Report
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-8 print:shadow-none print:border-none">
        {/* Report Header Banner */}
        <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">SmartLib System Report</h2>
            <p className="text-xs text-slate-500">Generated on: {new Date().toLocaleString()}</p>
          </div>
          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">
            CONFIDENTIAL AUDIT
          </span>
        </div>

        {/* Core Key Performance Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Total Book Inventory</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary.totalBooks}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Registered Members</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary.totalUsers}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Currently Borrowed</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">{summary.currentlyBorrowed}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">Overdue Loans</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1">{summary.overdueBooks}</p>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Category Stock Summary</h3>
          <table className="w-full text-left text-xs text-slate-700 border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-600 uppercase">
              <tr>
                <th className="p-3">Category Name</th>
                <th className="p-3">Total Titles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryStats.map((c, i) => (
                <tr key={i}>
                  <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="p-3 font-bold text-indigo-600">{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popular Books Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Most Borrowed Titles</h3>
          <table className="w-full text-left text-xs text-slate-700 border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-600 uppercase">
              <tr>
                <th className="p-3">Book Title</th>
                <th className="p-3">Total Times Borrowed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {popularBooks.map((b, i) => (
                <tr key={i}>
                  <td className="p-3 font-semibold text-slate-900">{b.title}</td>
                  <td className="p-3 font-bold text-indigo-600">{b.borrowCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
