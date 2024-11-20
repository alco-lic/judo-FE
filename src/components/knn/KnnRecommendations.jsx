import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../common/AxiosInstance';
import { AuthContext } from '../../contexts/AuthContext';
import KnnProcessGraph from './KnnProcessGraph'

import testImage from '../../assets/test_image.png';
import favoriteIcon from '../../assets/bookmark_clear.png';
import favoriteFilledIcon from '../../assets/bookmark_blue.png';
import cartIcon from '../../assets/cart.png';

import './KnnRecommendations.css';

const KnnRecommendations = () => {
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    
    const { isAuthenticated } = useContext(AuthContext); // Get authentication status from context
    const navigate = useNavigate(); 

    const tasteMapping = [
        "Smooth", 
        "Balanced", 
        "Light", 
        "Botanical", 
        "Peaty", 
        "Clean", 
        "Sweet", 
        "Crisp", 
        "Smoky", 
        "Fruity", 
        "Rich", 
        "Herbal", 
        "Nutty", 
        "Spiced", 
        "Bubbly", 
        "Bold"
    ];

    const [selectedTastes, setSelectedTastes] = useState(() => {
        // LocalStorage에서 선택된 키워드 복원
        const savedTastes = localStorage.getItem('selectedTastes');
        return savedTastes ? JSON.parse(savedTastes) : [];
    });
    const [k, setK] = useState(5); // Default k 값
    const [recommendations, setRecommendations] = useState([]);
    const [processData, setProcessData] = useState(null);

    const toggleTaste = (taste) => {
        setSelectedTastes((prev) => {
            const updatedTastes = prev.includes(taste)
                ? prev.filter((t) => t !== taste)
                : [...prev, taste];
            // LocalStorage에 선택된 키워드 저장
            localStorage.setItem('selectedTastes', JSON.stringify(updatedTastes));
            return updatedTastes;
        });
    };

    const fetchKnnRecommendations = async () => {
        if (selectedTastes.length === 0) return;

        try {
            // console.log("Selected Tastes:", selectedTastes);
            const response = await axiosInstance.get('/api/drink-feature/knn/process', {
                params: { userTasteProfile: selectedTastes.join(' '), k },
            });
            // console.log("Response Data:", response.data.data);
            
            // 백엔드 응답 데이터에서 추천 목록 추출
            const recommendationsData = response.data.data?.topKRecommendations || [];
            setRecommendations(recommendationsData);
        } catch (error) {
            console.error("KNN 추천 요청 실패:", error);
        }
    };

    const fetchKnnProcessData = async () => {
        if (!isAuthenticated || selectedTastes.length === 0) return;

        // console.log("recommendations:", recommendations)
        try {
            const response = await axiosInstance.get('/api/drink-feature/knn/process', {
                params: { userTasteProfile: selectedTastes.join(' '), k },
            });
            setProcessData(response.data.data);
        } catch (error) {
            console.error("KNN 과정 요청 실패:", error);
        }
    };

    useEffect(() => {
        fetchKnnRecommendations();
    }, [selectedTastes, k, isAuthenticated]);

    // 찜한 상품 불러오기 (로그인 시만 수행)
    useEffect(() => {
        if (isAuthenticated) {
            const fetchFavorites = async () => {
                try {
                    const response = await axiosInstance.get('/api/wishlist/all');
                    const favoriteIds = response.data.map((item) => item.drink.id);
                    setFavorites(favoriteIds);
                } catch (error) {
                    console.error("Error fetching favorites:", error);
                }
            };

            fetchFavorites();
        }
    }, [isAuthenticated]);

    // 장바구니에 담긴 상품 불러오기 (로그인 시만 수행)
    useEffect(() => {
        if (isAuthenticated) {
            const fetchCartItems = async () => {
                try {
                    const response = await axiosInstance.get('/api/cart/all');
                    const cartIds = response.data.map((item) => item.drinkId);
                    setCartItems(cartIds);
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                }
            };

            fetchCartItems();
        }
    }, [isAuthenticated]);

    // 찜하기 기능
    const toggleFavorite = async (drinkId) => {
        const isAlreadyFavorite = favorites.includes(drinkId);

        try {
            await axiosInstance.post('/api/wishlist/new', {
                drinkId,
                isFavorite: !isAlreadyFavorite
            });

            setFavorites((prevFavorites) => 
                isAlreadyFavorite
                    ? prevFavorites.filter((id) => id !== drinkId)
                    : [...prevFavorites, drinkId]
            );
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    // 장바구니 추가 기능
    const toggleCart = async (drinkId) => {
        const isAlreadyInCart = cartItems.includes(drinkId);

        try {
            await axiosInstance.post('/api/cart/new', {
                drinkId,
                isInCart: !isAlreadyInCart
            });

            setCartItems((prevCartItems) => 
                isAlreadyInCart
                    ? prevCartItems.filter((id) => id !== drinkId)
                    : [...prevCartItems, drinkId]
            );
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    // 세부 정보 화면으로 이동
    const goToDetail = (drinkId) => {
        navigate(`/drink/${drinkId}`);
    };
    
    return (
        <div className="knn-recommendations">
            <div className="knn-input-section">
                <h3>키워드 선택</h3>
                <div className="taste-buttons-container">
                    {tasteMapping.map((taste) => (
                        <button
                            key={taste}
                            className={`taste-button ${selectedTastes.includes(taste) ? 'selected' : ''}`}
                            onClick={() => toggleTaste(taste)}
                        >
                            {taste}
                        </button>
                    ))}
                </div>
                <button onClick={fetchKnnProcessData} className="similarity-check-button">유사도 확인</button> 
            </div>
    
            <div className="divider"></div>
    
            <div className="selected-tastes-container">
                <h3>선택된 키워드</h3>
                {selectedTastes.length > 0 ? (
                    <ul className="selected-tastes-list">
                        {selectedTastes.map((taste, index) => (
                            <li key={index}>{taste}</li>
                        ))}
                    </ul>
                ) : (
                    <p>선택된 키워드가 없습니다.</p>
                )}
            </div>
    
            <div className="divider"></div>
    
            <div className="recommendations-container">
                <h3>추천 음료</h3>
                {recommendations.length > 0 ? (
                    <div className="recommended-drinks-list">
                        {recommendations.map((drink) => (
                            <div key={drink.id} className="recommended-drink-item">
                                <img
                                    src={testImage}
                                    alt={drink.name}
                                    className="drink-image"
                                    onClick={() => goToDetail(drink.id)}
                                />
                                <div className="drink-details">
                                    <h3>{drink.name}</h3>
                                    <p>{drink.type} - {drink.abv}도</p>
    
                                    <img
                                        src={favorites.includes(drink.id) ? favoriteFilledIcon : favoriteIcon}
                                        alt="찜하기"
                                        className="icon favorite-icon"
                                        onClick={() => toggleFavorite(drink.id)}
                                    />
    
                                    <img
                                        src={cartIcon}
                                        alt="장바구니"
                                        className="icon cart-icon"
                                        onClick={() => {
                                            toggleCart(drink.id);
                                            alert('장바구니에 추가하였습니다!');
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>추천 음료가 없습니다.</p>
                )}
            </div>
    
            {processData && (
                <>
                <div className="divider"></div>
                <div className="process-data-section">
                    <h3>유사도 확인</h3>
                    <KnnProcessGraph data={processData.topKRecommendations} />
                </div>
                </>
            )}
        </div>
    );
    
};

export default KnnRecommendations;
