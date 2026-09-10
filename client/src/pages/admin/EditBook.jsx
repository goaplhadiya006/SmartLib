import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import API from '../../services/api';

const EditBook = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [totalCopies, setTotalCopies] = useState(1);
  const [availableCopies, setAvailableCopies] = useState(1);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, bookRes] = await Promise.all([
          API.get('/categories'),
          API.get(`/books/${id}`),
        ]);
        setCategories(catRes.data);

        const b = bookRes.data;
        setTitle(b.title);
        setAuthor(b.author);
        setDescription(b.description);
        setCategory(b.category?._id || b.category);
        setIsbn(b.isbn);
        setPublicationYear(b.publicationYear);
        setTotalCopies(b.totalCopies);
        setAvailableCopies(b.availableCopies);
        setCoverImageUrl(b.coverImage);
        setPreview(b.coverImage);
      } catch (error) {
        console.error('Failed to fetch book data:', error);
        toast.error('Failed to load book data');
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      await API.put(`/books/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(`Updated book "${title}" successfully!`);
      navigate('/admin/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading book for editing..." />;

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
            <Edit className="w-6 h-6 text-indigo-600" /> Edit Book Details
          </h1>
          <p className="text-xs text-slate-500 mt-1">Modify inventory records or replace cover image.</p>
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
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500"
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
                onChange={(e) => setTotalCopies(parseInt(e.target.value, 10))}
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

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-600">Cover Image</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white"
              />
              <span className="text-xs text-slate-400 font-semibold">OR</span>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Image URL..."
                className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            {preview && (
              <div className="pt-2 flex items-center gap-3">
                <img
                  src={preview}
                  alt="Cover Preview"
                  className="w-16 h-20 object-cover rounded-lg border border-slate-300"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Book Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
