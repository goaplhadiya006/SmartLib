import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Upload, BookOpen } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';

const AddBook = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publicationYear, setPublicationYear] = useState(new Date().getFullYear());
  const [totalCopies, setTotalCopies] = useState(5);
  const [availableCopies, setAvailableCopies] = useState(5);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
        if (res.data.length > 0) setCategory(res.data[0]._id);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !description || !category || !isbn) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('isbn', isbn);
      formData.append('publicationYear', publicationYear);
      formData.append('totalCopies', totalCopies);
      formData.append('availableCopies', availableCopies);

      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      } else if (coverImageUrl) {
        formData.append('coverImage', coverImageUrl);
      }

      await API.post('/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(`Book "${title}" added successfully!`);
      navigate('/admin/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin/books"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Books List
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-indigo-600" /> Add New Book to Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">Fill in the book information and upload cover image.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Book Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clean Architecture"
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Author Name *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Robert C. Martin"
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed synopsis of the book..."
              className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">ISBN *</label>
              <input
                type="text"
                required
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-0134494166"
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Publication Year *</label>
              <input
                type="number"
                required
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Total Copies Count *</label>
              <input
                type="number"
                min={1}
                required
                value={totalCopies}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTotalCopies(val);
                  setAvailableCopies(val);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Available Copies *</label>
              <input
                type="number"
                min={0}
                required
                value={availableCopies}
                onChange={(e) => setAvailableCopies(parseInt(e.target.value, 10))}
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-600">Cover Image Upload (Multer)</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
              <span className="text-xs text-slate-400 font-semibold">OR</span>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Paste Image URL (Unsplash, etc.)..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            {(preview || coverImageUrl) && (
              <div className="pt-2 flex items-center gap-3">
                <img
                  src={preview || coverImageUrl}
                  alt="Cover Preview"
                  className="w-16 h-20 object-cover rounded-lg border border-slate-300"
                />
                <span className="text-xs text-slate-500 font-semibold">Image Preview Ready</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Book Record...' : 'Publish Book to Catalog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
