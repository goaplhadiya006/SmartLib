import React, { useState, useEffect } from 'react';
import { Heart, Trash2, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

const Wishlist = () => {
  const toast = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await API.get('/wishlist');
      setWishlist(res.data);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await API.delete(`/wishlist/${itemId}`);
      toast.info('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-current" /> My Saved Wishlist
        </h1>
        <p className="text-slate-500 text-sm">
          Keep track of books you want to read or borrow later.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching wishlist..." />
      ) : wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h3>
          <p className="text-slate-500 text-sm">
            Save books to your wishlist while browsing so you can easily access or borrow them later.
          </p>
          <Link
            to="/books"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="relative group">
              <BookCard
                book={item.book}
                inWishlist={true}
                onWishlistToggle={() => handleRemove(item._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
