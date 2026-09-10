import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, size = 'sm', showScore = true }) => {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'xl' ? 'w-6 h-6' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-100 text-slate-300'
          }`}
        />
      ))}
      {showScore && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
