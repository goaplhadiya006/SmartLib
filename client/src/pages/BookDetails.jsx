import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Barcode,
  Copy,
  CheckCircle,
  XCircle,
  Heart,
  Star,
  MessageSquare,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
    } catch (error) {
      console.error('Failed to load book details:', error);
      toast.error('Book not found');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user) return;
    try {
      const res = await API.get('/wishlist');
      const found = res.data.some((item) => item.book._id === id || item.book === id);
      setWishlisted(found);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  useEffect(() => {
    fetchBook();
    checkWishlistStatus();
  }, [id, user]);

  const isAvailable = book && book.availableCopies > 0;

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
      fetchBook();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.info('Please log in to manage your wishlist');
      return navigate('/login');
    }

    setWishlistLoading(true);
    try {
      if (wishlisted) {
        const res = await API.get('/wishlist');
        const item = res.data.find((w) => w.book._id === id || w.book === id);
        if (item) {
          await API.delete(`/wishlist/${item._id}`);
        }
        setWishlisted(false);
        toast.info('Removed from wishlist');
      } else {
        await API.post('/wishlist', { bookId: id });
        setWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to leave a review');
      return navigate('/login');
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setReviewSubmitting(true);
    try {
      await API.post(`/books/${id}/reviews`, { rating, comment });
      toast.success('Thank you! Your review has been submitted.');
      setComment('');
      fetchBook();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading book details..." />;
  if (!book)
    return (
      <div className="max-w-md mx-auto my-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Book Not Found</h2>
        <Link to="/books" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold">
          Back to Books
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button */}
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {/* Main Details Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cover Image Col */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 aspect-[3/4]">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg transition-all ${
                wishlisted
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Info Col */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
              {book.category?.name || 'General'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-base text-slate-600 font-semibold mt-1">by {book.author}</p>
          </div>

          <div className="flex items-center gap-4 py-3 border-y border-slate-100">
            <RatingStars rating={book.rating || 4.5} size="lg" />
            <span className="text-xs text-slate-400 font-medium">({book.reviews?.length || 0} reviews)</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{book.description}</p>
          </div>

          {/* Book Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Barcode className="w-3.5 h-3.5 text-indigo-500" /> ISBN
              </span>
              <p className="font-bold text-slate-900 mt-1">{book.isbn}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Published
              </span>
              <p className="font-bold text-slate-900 mt-1">{book.publicationYear}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Copy className="w-3.5 h-3.5 text-indigo-500" /> Total Copies
              </span>
              <p className="font-bold text-slate-900 mt-1">{book.totalCopies}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Available
              </span>
              <p className="font-bold text-emerald-600 mt-1">{book.availableCopies}</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={handleBorrow}
              disabled={!isAvailable || borrowing}
              className={`flex-1 min-w-[200px] py-4 px-6 rounded-2xl text-sm font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                isAvailable
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              {borrowing ? 'Processing Borrow...' : isAvailable ? 'Borrow This Book Now' : 'Out of Stock'}
            </button>

            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`py-4 px-6 rounded-2xl text-sm font-bold border transition-colors flex items-center gap-2 ${
                wishlisted
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              {wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" /> Reader Reviews ({book.reviews?.length || 0})
        </h2>

        {/* Submit Review Form */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Leave Your Rating & Review</h3>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        num <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this book with fellow readers..."
              className="w-full p-4 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              {reviewSubmitting ? 'Posting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {book.reviews && book.reviews.length > 0 ? (
            book.reviews.map((rev, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {rev.userName ? rev.userName.charAt(0) : 'U'}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{rev.userName}</span>
                  </div>
                  <RatingStars rating={rev.rating} />
                </div>
                <p className="text-sm text-slate-600 pl-10">{rev.comment}</p>
                <p className="text-[11px] text-slate-400 pl-10">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-6">
              No reviews yet for this book. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
