import React, { useState, useEffect } from 'react';
import { BookmarkCheck, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';

const ManageBorrowings = () => {
  const toast = useToast();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchBorrowings = async () => {
    try {
      const res = await API.get('/borrow/all');
      setBorrowings(res.data);
    } catch (error) {
      console.error('Failed to load borrowings:', error);
      toast.error('Failed to load borrowings log');
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
      toast.success(`Marked "${selectedBorrow.book?.title}" as Returned!`);
      setConfirmOpen(false);
      setSelectedBorrow(null);
      fetchBorrowings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process return');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage All Borrowings</h1>
        <p className="text-xs text-slate-500">Monitor active loans, issue return confirmations, and track due dates across members.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading borrowings records..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Book Title</th>
                  <th className="py-4 px-6">Borrow Date</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {borrowings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <p>{b.user?.name || 'Unknown User'}</p>
                      <p className="text-xs text-slate-400 font-normal">{b.user?.email}</p>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {b.book?.title || 'Unknown Book'}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(b.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                      {new Date(b.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {b.status === 'Returned' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" /> Returned
                        </span>
                      ) : b.status === 'Overdue' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          <AlertTriangle className="w-3.5 h-3.5" /> Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                          <BookmarkCheck className="w-3.5 h-3.5" /> Borrowed
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {b.status !== 'Returned' && (
                        <button
                          onClick={() => {
                            setSelectedBorrow(b);
                            setConfirmOpen(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Return Confirmation"
        message={`Mark "${selectedBorrow?.book?.title}" borrowed by ${selectedBorrow?.user?.name} as returned?`}
        confirmText="Confirm Return"
        onConfirm={handleReturnConfirm}
        onClose={() => setConfirmOpen(false)}
        isDanger={false}
      />
    </div>
  );
};

export default ManageBorrowings;
