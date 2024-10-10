import React from 'react';
import './UserReviewCard.css';

const UserReviewCard = ({ rating, review }) => {
    const stars = Array(5).fill(0); // Array for stars

    return (
        <div className="user-review-card">
            <div className="user-review-card__ratings">
                {stars.map((_, index) => (
                    <span key={index} className={`user-review-card__star ${index < rating ? 'filled' : ''}`}>
                        ★
                    </span>
                ))}
            </div>
            <p className="user-review-card__review">{review}</p>
        </div>
    );
};

export default UserReviewCard;
