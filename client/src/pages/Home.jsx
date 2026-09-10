import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Star,
  Award,
} from 'lucide-react';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, categoriesRes] = await Promise.all([
          API.get('/books/featured'),
          API.get('/categories'),
        ]);
        setFeaturedBooks(featuredRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Library Management System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Discover Your Next Great <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-400">Literary Adventure</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Access thousands of books, research papers, and bestsellers across computer science, fiction, business, and science with instant online borrowing.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, or ISBN..."
                    className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/15 transition-all text-sm sm:text-base backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/40 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Category Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-medium text-slate-400">
                <span>Popular:</span>
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/books?category=${cat._id}`}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white transition-colors border border-slate-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Hero Image Stack */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800/80">
                  <img
                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80"
                    alt="Library Showcase"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Featured Collection</p>
                      <p className="text-base font-bold text-white">2026 Tech & Science Bestsellers</p>
                    </div>
                    <Link
                      to="/books"
                      className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <div className="flex items-center gap-4 p-2">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">15,000+</p>
              <p className="text-xs font-semibold text-slate-500">Books & Volumes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">4,200+</p>
              <p className="text-xs font-semibold text-slate-500">Active Borrowers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">99.4%</p>
              <p className="text-xs font-semibold text-slate-500">Satisfaction Rate</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">24/7</p>
              <p className="text-xs font-semibold text-slate-500">Digital Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-2">
              <TrendingUp className="w-3.5 h-3.5" /> Curated Picks
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured & Popular Books</h2>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View All Books <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching top featured books..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">Explore By Category</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              From Computer Science and Artificial Intelligence to Fiction and Economic History, find books organized cleanly by topic.
            </p>
            <div className="pt-4">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-sm shadow-lg transition-all"
              >
                Browse All Categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Simple Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How SmartLib Works</h2>
          <p className="text-slate-500 text-sm">Borrow your favorite books in just 3 easy steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4 relative group hover:border-indigo-200 transition-colors">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              1
            </div>
            <h3 className="font-bold text-xl text-slate-900">Browse & Search</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Explore our extensive library catalog by author, category, ISBN, or availability status.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4 relative group hover:border-indigo-200 transition-colors">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              2
            </div>
            <h3 className="font-bold text-xl text-slate-900">Borrow Instantly</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Click borrow to claim your copy. Standard borrowing period generates automatic 14-day due dates.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4 relative group hover:border-indigo-200 transition-colors">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              3
            </div>
            <h3 className="font-bold text-xl text-slate-900">Return & Review</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Return books when finished to make them available for others, and leave ratings and reviews!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl shadow-indigo-200">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Start Reading?</h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join thousands of registered readers and get instant access to our complete digital collection today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl text-sm shadow-md transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/books"
              className="px-6 py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl text-sm transition-colors border border-indigo-500/50"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
