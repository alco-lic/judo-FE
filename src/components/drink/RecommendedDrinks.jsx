import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../common/AxiosInstance';
import { AuthContext } from '../../contexts/AuthContext';
import testImage from '../../assets/test_image.png';

import favoriteIcon from '../../assets/bookmark_clear.png';
import favoriteFilledIcon from '../../assets/bookmark_blue.png';
import cartIcon from '../../assets/cart.png';

import './RecommendedDrinks.css';

const RecommendedDrinks = ({ onToggleFavorite, onToggleCart, onGoToDetail, favorites }) => {
    const [recommendedDrinks, setRecommendedDrinks] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    const [recommendationType, setRecommendationType] = useState('all');

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchRecommendations = async () => {
            try {
                let response;
                if (recommendationType === 'wishlist') {
                    response = await axiosInstance.get('/api/recommendations/wishlist');
                } else if (recommendationType === 'cart') {
                    response = await axiosInstance.get('/api/recommendations/cart');
                } else if (recommendationType === 'payment-history') {
                    response = await axiosInstance.get('/api/recommendations/payment-history');
                } else {
                    response = await axiosInstance.get('/api/recommendations/all');
                }

                setRecommendedDrinks(response.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [isAuthenticated, recommendationType]);

    const changeRecommendationType = (type) => {
        setRecommendationType(type);
    };

    return (
        <div className="recommended-drinks">
            <h2>추천 상품</h2>

            <div className="recommendation-buttons">
                <button
                    onClick={() => changeRecommendationType('all')}
                    className={recommendationType === 'all' ? 'active' : ''}
                >
                    통합 추천
                </button>
                <button
                    onClick={() => changeRecommendationType('wishlist')}
                    className={recommendationType === 'wishlist' ? 'active' : ''}
                >
                    찜한 상품
                </button>
                <button
                    onClick={() => changeRecommendationType('cart')}
                    className={recommendationType === 'cart' ? 'active' : ''}
                >
                    장바구니
                </button>
                <button
                    onClick={() => changeRecommendationType('payment-history')}
                    className={recommendationType === 'payment-history' ? 'active' : ''}
                >
                    구매 내역
                </button>
            </div>

            {recommendedDrinks.length > 0 ? (
                <div className="recommended-list">
                    {recommendedDrinks.map((drink) => (
                        <div key={drink.id} className="recommended-drink">
                            <img
                                src={testImage}
                                alt={drink.name}
                                className="drink-image"
                                onClick={() => onGoToDetail(drink.id)}
                            />
                            <div className="drink-details">
                                <h3>{drink.name}</h3>
                                <p>{drink.type} - {drink.abv}도</p>

                                {/* 찜하기 아이콘 동적 변경 */}
                                <img
                                    src={favorites.includes(drink.id) ? favoriteFilledIcon : favoriteIcon} // 상태에 따라 아이콘 변경
                                    alt="찜하기"
                                    className="icon"
                                    onClick={() => onToggleFavorite(drink.id)}
                                />

                                {/* 장바구니 버튼 */}
                                <img
                                    src={cartIcon}
                                    alt="장바구니"
                                    className="icon"
                                    onClick={() => {
                                        onToggleCart(drink.id);
                                        alert('장바구니에 추가하였습니다!'); // 알림 메시지 표시
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-result">추천 상품이 없습니다.</div>
            )}
        </div>
    );
};

export default RecommendedDrinks;
