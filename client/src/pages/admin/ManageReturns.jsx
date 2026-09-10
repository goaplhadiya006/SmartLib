import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, Search } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';

const ManageReturns = () => {
  const toast = useToast();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchBorrowings = async () => {
    try {
      const res = await API.get('/borrow/all');
      setBorrowings(res.data);
    } catch (error) {
      console.error('Failed to load borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleReturnConfirm = async () => {
    if (!selectedBorrow) return;
    try {
      await API.put(`/borrow/${selectedBorrow._id}/return`);
      toast.success(`Book "${selectedBorrow.book?.title}" returned!`);
      setConfirmOpen(false);
      setSelectedBorrow(null);
      fetchBorrowings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process return');
    }
  };

  const pendingReturns = borrowings.filter(
    (b) =>
      b.status !== 'Returned' &&
      (b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.book?.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Returns Management Desk</h1>
        <p className="text-xs text-slate-500">Quickly process book return check-ins as members bring back borrowed titles.</p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter active loans by user name, email, or book title..."
          className="w-full text-sm text-slate-900 focus:outline-none"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching active loans..." />
      ) : pendingReturns.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">All Returns Clear!</h3>
          <p className="text-slate-500 text-xs">
            No active borrowings waiting for check-in match your query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingReturns.map((b) => (
            <div key={b._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-600 uppercase">{b.user?.name}</p>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{b.book?.title}</h4>
                <p className="text-[11px] text-slate-400">
                  Due: {new Date(b.dueDate).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedBorrow(b);
                  setConfirmOpen(true);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-4 h-4" /> Check In
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Check In Return Confirmation"
        message={`Check in "${selectedBorrow?.book?.title}" returned by ${selectedBorrow?.user?.name}?`}
        confirmText="Confirm Check In"
        onConfirm={handleReturnConfirm}
        onClose={() => setConfirmOpen(false)}
        isDanger={false}
      />
    </div>
  );
};

export default ManageReturns;
