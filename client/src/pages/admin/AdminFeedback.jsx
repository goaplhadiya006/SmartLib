import React, { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import API from '../../services/api';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await API.get('/feedback');
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Failed to load feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" /> User Feedback & Testimonials Log
        </h1>
        <p className="text-xs text-slate-500">Review feedback and rating submissions submitted by library members.</p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading feedback entries..." />
      ) : feedbacks.length === 0 ? (
        <p className="text-slate-500 text-sm">No feedback submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{fb.name}</h4>
                  <p className="text-xs text-slate-400">{fb.email} • {new Date(fb.createdAt).toLocaleDateString()}</p>
                </div>
                <RatingStars rating={fb.rating} />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">"{fb.message}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
