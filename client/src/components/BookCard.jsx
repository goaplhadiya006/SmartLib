import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import RatingStars from './RatingStars';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

const BookCard = ({ book, onBorrowSuccess, inWishlist = false, onWishlistToggle }) => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [borrowing, setBorrowing] = useState(false);
  const [wishlisted, setWishlisted] = useState(inWishlist);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isAvailable = book.availableCopies > 0;

  const handleBorrow = async () => {
    if (!user) {
      toast.info('Please log in to borrow books');
      return navigate('/login');
    }

    if (!isAvailable) {
      toast.error('This book is currently out of stock');
      return;
    }

    setBorrowing(true);
    try {
      await API.post('/borrow', { bookId: book._id });
      toast.success(`Successfully borrowed "${book.title}"!`);
      if (onBorrowSuccess) onBorrowSuccess(book._id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.info('Please log in to manage your wishlist');
      return navigate('/login');
    }

    setWishlistLoading(true);
    try {
      if (wishlisted) {
        // If wishlist item passed, we can call toggle
        if (onWishlistToggle) {
          await onWishlistToggle(book._id);
        } else {
          // get user wishlist first or remove
          const res = await API.get('/wishlist');
          const item = res.data.find((w) => w.book._id === book._id || w.book === book._id);
          if (item) {
            await API.delete(`/wishlist/${item._id}`);
          }
        }
        setWishlisted(false);
        toast.info(`Removed "${book.title}" from wishlist`);
      } else {
        await API.post('/wishlist', { bookId: book._id });
        setWishlisted(true);
        toast.success(`Added "${book.title}" to wishlist!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Cover & Badges */}
        <div className="relative overflow-hidden rounded-xl bg-slate-100 mb-4 aspect-[3/4]">
          <img
            src={book.coverImage?.startsWith('/uploads') ? book.coverImage : book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <Link
              to={`/books/${book._id}`}
              className="w-full text-center py-2 px-3 bg-white/90 backdrop-blur-md text-slate-900 font-semibold rounded-lg text-xs hover:bg-white transition-colors"
            >
              View Full Details
            </Link>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
              wishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Availability Tag */}
          <div className="absolute top-3 left-3">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
                <CheckCircle className="w-3 h-3" /> {book.availableCopies} Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/90 text-white backdrop-blur-md shadow-sm">
                <XCircle className="w-3 h-3" /> Borrowed Out
              </span>
            )}
          </div>
        </div>

        {/* Category & Title */}
        <div className="mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {book.category?.name || 'General'}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
          <Link to={`/books/${book._id}`}>{book.title}</Link>
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-3">by {book.author}</p>
      </div>

      {/* Rating & Action Buttons */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <RatingStars rating={book.rating || 4.5} />
          <span className="text-xs text-slate-400 font-medium">{book.publicationYear}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/books/${book._id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> Details
          </Link>
          <button
            onClick={handleBorrow}
            disabled={!isAvailable || borrowing}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-all ${
              isAvailable
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {borrowing ? 'Processing...' : 'Borrow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
