import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BookmarkCheck,
  CheckCircle,
  AlertTriangle,
  FolderKanban,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../services/api';

const COLORS = ['#4f46e5', '#7c3aed', '#0d9488', '#d97706', '#e11d48', '#2563eb'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/borrow/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to load admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Generating dashboard statistics..." />;
  if (!stats) return <p className="text-center py-10">Failed to load statistics.</p>;

  const { summary, monthlyStats, categoryStats, popularBooks } = stats;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Overview Dashboard</h1>
        <p className="text-xs text-slate-500">Real-time statistics on library inventory, borrowings, and users.</p>
      </div>

      {/* Summary Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.totalBooks}</p>
          <p className="text-xs font-semibold text-slate-500">Total Books</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl w-fit">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.totalUsers}</p>
          <p className="text-xs font-semibold text-slate-500">Total Users</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl w-fit">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.currentlyBorrowed}</p>
          <p className="text-xs font-semibold text-slate-500">Borrowed Out</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.availableBooks}</p>
          <p className="text-xs font-semibold text-slate-500">Available Copies</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.overdueBooks}</p>
          <p className="text-xs font-semibold text-slate-500">Overdue Books</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit">
            <FolderKanban className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.totalCategories}</p>
          <p className="text-xs font-semibold text-slate-500">Categories</p>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Borrowing Activity AreaChart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" /> Monthly Borrowing Activity
            </h3>
            <span className="text-xs text-slate-400 font-medium">Last 6 Months</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="colorBorrow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="borrowings" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorBorrow)" name="Borrowings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown PieChart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Category Distribution</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Books Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Top 5 Most Borrowed Books</h3>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularBooks}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="title" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="borrowCount" fill="#7c3aed" radius={[8, 8, 0, 0]} name="Times Borrowed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
