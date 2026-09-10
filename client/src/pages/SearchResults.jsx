import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/books?search=${encodeURIComponent(query)}&limit=20`);
        setBooks(res.data.books);
      } catch (error) {
        console.error('Failed to search books:', error);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Search className="w-8 h-8 text-indigo-600" /> Search Results
        </h1>
        <p className="text-slate-500 text-sm">
          Showing search results for "<span className="font-bold text-slate-800">{query}</span>" ({books.length} matches found).
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text={`Searching for "${query}"...`} />
      ) : books.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto space-y-4">
          <h3 className="text-xl font-bold text-slate-900">No Matching Books</h3>
          <p className="text-slate-500 text-sm">
            We couldn't find any books matching "{query}". Try checking for spelling errors or search for broader keywords.
          </p>
          <Link
            to="/books"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm"
          >
            Browse All Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
