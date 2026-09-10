import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, BookOpen, ArrowRight, Layers } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Book Categories
        </h1>
        <p className="text-slate-500 text-sm">
          Filter our vast collection by subject areas, academic fields, and literary genres.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> {cat.bookCount || 0} Books
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {cat.description || 'Comprehensive collection of books and learning resources.'}
                </p>
              </div>

              <Link
                to={`/books?category=${cat._id}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Browse Books <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
