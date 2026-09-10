import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mail, RotateCcw, ShieldAlert } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';

const OverdueBooks = () => {
  const toast = useToast();
  const [overdueList, setOverdueList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchOverdue = async () => {
    try {
      const res = await API.get('/borrow/overdue');
      setOverdueList(res.data);
    } catch (error) {
      console.error('Failed to load overdue books:', error);
      toast.error('Failed to load overdue list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdue();
  }, []);

  const handleReturnConfirm = async () => {
    if (!selectedBorrow) return;
    try {
      await API.put(`/borrow/${selectedBorrow._id}/return`);
      toast.success(`Resolved overdue status for "${selectedBorrow.book?.title}"!`);
      setConfirmOpen(false);
      setSelectedBorrow(null);
      fetchOverdue();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-rose-500" /> Overdue Books & Delinquency Alerts
        </h1>
        <p className="text-xs text-slate-500">Monitor loans past due date and contact borrowers.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Scanning for overdue loans..." />
      ) : overdueList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-3">
          <ShieldAlert className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Overdue Books</h3>
          <p className="text-slate-500 text-xs">All active borrowings are currently within their due date limit!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {overdueList.map((b) => {
            const dueDate = new Date(b.dueDate);
            const daysOverdue = Math.ceil((new Date() - dueDate) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={b._id}
                className="bg-rose-50/40 rounded-3xl p-6 border border-rose-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={b.book?.coverImage}
                    alt={b.book?.title}
                    className="w-14 h-20 object-cover rounded-xl border border-rose-200 shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {daysOverdue} Days Overdue
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{b.book?.title}</h3>
                    <p className="text-xs text-slate-600 font-medium">Borrower: {b.user?.name} ({b.user?.email})</p>
                    <p className="text-[11px] text-slate-400">Due Date: {dueDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${b.user?.email}?subject=Overdue Book Reminder: ${encodeURIComponent(b.book?.title)}`}
                    className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-600" /> Send Reminder Email
                  </a>
                  <button
                    onClick={() => {
                      setSelectedBorrow(b);
                      setConfirmOpen(true);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Force Return
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Force Overdue Return"
        message={`Force return check-in for overdue book "${selectedBorrow?.book?.title}" borrowed by ${selectedBorrow?.user?.name}?`}
        confirmText="Confirm Return"
        onConfirm={handleReturnConfirm}
        onClose={() => setConfirmOpen(false)}
        isDanger={false}
      />
    </div>
  );
};

export default OverdueBooks;
