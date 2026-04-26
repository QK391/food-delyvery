import { useState } from 'react';
import './StarRating.css';

const StarRating = ({ value = 0, onChange, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);
  const isInteractive = typeof onChange === 'function';

  const filled = isInteractive
    ? (hovered || 0)
    : Math.round(value);

  return (
    <div className={`star-rating star-rating--${size}${isInteractive ? ' star-rating--interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= filled ? 'star--filled' : 'star--empty'}`}
          onMouseEnter={isInteractive ? () => setHovered(star) : undefined}
          onMouseLeave={isInteractive ? () => setHovered(0) : undefined}
          onClick={isInteractive ? () => onChange(star) : undefined}
        >
          ★
        </span>
      ))}
      {!isInteractive && value > 0 && (
        <span className="star-rating__value">{value}</span>
      )}
    </div>
  );
};

export default StarRating;
