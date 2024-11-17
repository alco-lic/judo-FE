import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../common/AxiosInstance'; // Axios 인스턴스
import { AuthContext } from '../../contexts/AuthContext'; // 인증 정보
import testImage from '../../assets/test_image.png'; // 테스트 이미지
import './RecommendedDrinks.css';

const RecommendedDrinks = () => {
    const [recommendedDrinks, setRecommendedDrinks] = useState([]);
    const { isAuthenticated } = useContext(AuthContext); // 인증 상태 확인
    const [recommendationType, setRecommendationType] = useState('all'); // 추천 기준

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
                
                setRecommendedDrinks(response.data); // 추천된 음료 리스트 설정
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [isAuthenticated, recommendationType]); // 인증 상태나 추천 기준이 변경될 때마다 실행

    // 추천 기준을 변경하는 함수
    const changeRecommendationType = (type) => {
        setRecommendationType(type);
    };

    return (
        <div className="recommended-drinks">
            <h2>추천 상품</h2>
            
            {/* 추천 기준 변경 버튼 */}
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
                            <img src={testImage} alt={drink.name} />
                            <p>{drink.name}</p>
                            <p>{drink.type}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='no-result'>추천 상품이 없습니다.</div>
            )}
        </div>
    );
};

export default RecommendedDrinks;
