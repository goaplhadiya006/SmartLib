import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, AlertTriangle, RotateCcw, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

const MyBorrowedBooks = () => {
  const toast = useToast();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchMyBorrowings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/borrow/my');
      setBorrowings(res.data);
    } catch (error) {
      console.error('Failed to load borrowings:', error);
      toast.error('Failed to load your borrowings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBorrowings();
  }, []);

  const handleReturnConfirm = async () => {
    if (!selectedBorrow) return;

    try {
      await API.put(`/borrow/${selectedBorrow._id}/return`);
      toast.success(`Successfully returned "${selectedBorrow.book?.title}"!`);
      setConfirmOpen(false);
      setSelectedBorrow(null);
      fetchMyBorrowings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
  };

  const activeBorrowings = borrowings.filter((b) => b.status === 'Borrowed' || b.status === 'Overdue');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Active Borrowed Books
          </h1>
          <p className="text-slate-500 text-sm">
            View books currently borrowed, due dates, and trigger return requests.
          </p>
        </div>
        <Link
          to="/borrow-history"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors self-start"
        >
          <Clock className="w-4 h-4" /> View Past History
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching active borrowings..." />
      ) : activeBorrowings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Active Borrowed Books</h3>
          <p className="text-slate-500 text-sm">
            You don't currently have any borrowed books. Browse our catalog to borrow your next read!
          </p>
          <Link
            to="/books"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeBorrowings.map((b) => {
            const dueDate = new Date(b.dueDate);
            const isOverdue = b.status === 'Overdue' || dueDate < new Date();

            return (
              <div
                key={b._id}
                className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col sm:flex-row gap-6 transition-all ${
                  isOverdue ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/80'
                }`}
              >
                <img
                  src={b.book?.coverImage}
                  alt={b.book?.title}
                  className="w-full sm:w-32 h-44 object-cover rounded-2xl border border-slate-200 shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80';
                  }}
                />

                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {b.book?.category?.name || 'General'}
                      </span>
                      {isOverdue ? (
                        <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Overdue
                        </span>
                      ) : (
                        <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Active Borrow
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{b.book?.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">by {b.book?.author}</p>
                  </div>

                  <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Borrowed On:</span>
                      <span className="font-semibold">{new Date(b.borrowDate).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center justify-between ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                      <span>Due Date:</span>
                      <span className="font-semibold">{new Date(b.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBorrow(b);
                      setConfirmOpen(true);
                    }}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Return Book
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
        title="Return Book Confirmation"
        message={`Are you sure you want to return "${selectedBorrow?.book?.title}" to the library? This will increase available copies.`}
        confirmText="Return Book Now"
        onConfirm={handleReturnConfirm}
        onClose={() => setConfirmOpen(false)}
        isDanger={false}
      />
    </div>
  );
};

export default MyBorrowedBooks;
