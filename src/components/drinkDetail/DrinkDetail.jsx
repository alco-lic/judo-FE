import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../common/AxiosInstance';
import './DrinkDetail.css';
import UserReviewCard from './UserReviewCard';

import testImage from '../../assets/test_image.png'; // 테스트 이미지

const DrinkDetail = () => {
    const { id } = useParams(); // Get the drink id from the URL
    const [drink, setDrink] = useState(null);
    const navigate = useNavigate(); 

    // 임시데이터
    const userReviews = [
        { rating: 5, review: "This bourbon is incredibly smooth and flavorful!" },
        { rating: 4, review: "A great choice for bourbon lovers." },
        { rating: 5, review: "Perfect for sipping or mixing in cocktails!" },
    ];

    useEffect(() => {
        const fetchDrinkDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/drink/${id}`);
                setDrink(response.data.data);
            } catch (error) {
                console.error("Error fetching drink details:", error);
            }
        };

        fetchDrinkDetails();
    }, [id]);

    // 장바구니에 담기
    const addCart = async (drinkId) => {
        try {
            await axiosInstance.post('/api/cart/new', {
                drinkId
            });
            // 메인 페이지로 이동
            navigate('/')
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    if (!drink) {
        return <p>Loading...</p>;
    }

    return (
        <div className="drink-detail">
            <div className="drink-detail__image-container">
                <img src={testImage} alt={drink.name} className="drink-detail__image" />
            </div>
            <div className="drink-detail__info">
                <h2 className="drink-detail__name">{drink.name}</h2>
                <span className="drink-detail__price">${drink.price}</span>
                <p className="drink-detail__description">{drink.description}</p>
                <p className="drink-detail__detailed-description">{drink.detailedDescription}</p>
                <p className="drink-detail__taste-profile">Taste Profile: {drink.tasteProfile}</p>

                <div className="drink-detail__ratings">
                    {userReviews.map((review, index) => (
                        <UserReviewCard key={index} rating={review.rating} review={review.review} />
                    ))}
                </div>

                <button className="drink-detail__add-to-cart" onClick={() => addCart(drink.id)}>Add to Cart</button>
            </div>
        </div>
    );
};

export default DrinkDetail;
