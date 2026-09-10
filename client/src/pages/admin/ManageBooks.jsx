import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';

const ManageBooks = () => {
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/books', {
        params: { page, limit: 10, search },
      });
      setBooks(res.data.books);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Failed to load books:', error);
      toast.error('Failed to fetch books list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search]);

  const handleDeleteConfirm = async () => {
    if (!selectedBook) return;
    try {
      await API.delete(`/books/${selectedBook._id}`);
      toast.success(`Deleted book "${selectedBook.title}"`);
      setDeleteModalOpen(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Book Inventory</h1>
          <p className="text-xs text-slate-500">View, update, or remove books in the library catalog ({total} total).</p>
        </div>
        <Link
          to="/admin/books/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors self-start"
        >
          <PlusCircle className="w-4 h-4" /> Add New Book
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search inventory by title, author, or ISBN..."
          className="w-full text-sm text-slate-900 focus:outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Fetching inventory..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Book Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">ISBN</th>
                  <th className="py-4 px-6">Total / Available</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded-md border border-slate-200"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <p className="line-clamp-1">{book.title}</p>
                        <p className="text-xs text-slate-400 font-normal">by {book.author}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs font-semibold text-indigo-600">
                      {book.category?.name || 'General'}
                    </td>
                    <td className="py-4 px-6 text-xs font-mono text-slate-500">{book.isbn}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">{book.availableCopies}</span>
                      <span className="text-slate-400 text-xs"> / {book.totalCopies}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/books/edit/${book._id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Book"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedBook(book);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100">
            <Pagination page={page} pages={pages} onPageChange={(p) => setPage(p)} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Book Confirmation"
        message={`Are you sure you want to permanently remove "${selectedBook?.title}" from the library database?`}
        confirmText="Delete Book"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default ManageBooks;
