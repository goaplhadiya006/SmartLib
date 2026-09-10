import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, BookOpen } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../services/api';

const BorrowHistory = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/borrow/my');
        // Filter returned books
        setBorrowings(res.data.filter((b) => b.status === 'Returned'));
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Clock className="w-8 h-8 text-indigo-600" /> Borrowing History
        </h1>
        <p className="text-slate-500 text-sm">
          A complete record of all books you have returned to SmartLib Library.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching borrowing history..." />
      ) : borrowings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-4">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">No Returned Books Yet</h3>
          <p className="text-slate-500 text-sm">
            You don't have any past returned books in your borrowing log.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Book Title</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Borrow Date</th>
                  <th className="py-4 px-6">Return Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {borrowings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={b.book?.coverImage}
                        alt={b.book?.title}
                        className="w-10 h-14 object-cover rounded-md border border-slate-200"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span>{b.book?.title}</span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{b.book?.author}</td>
                    <td className="py-4 px-6 text-slate-500">{new Date(b.borrowDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-slate-500">{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : '-'}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Returned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowHistory;
