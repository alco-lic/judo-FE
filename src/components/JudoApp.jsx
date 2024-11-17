import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './common/AxiosInstance';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import './JudoApp.css';
import DrinkCard from './drink/DrinkCard';
import RecommendedDrinks from './drink/RecommendedDrinks'; // 추천 상품 컴포넌트

const JudoApp = () => {
    const [drinks, setDrinks] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    
    const { isAuthenticated } = useContext(AuthContext); // Get authentication status from context
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const response = await axiosInstance.get('/api/drink/all');
                setDrinks(response.data.data.content);
            } catch (error) {
                console.error("Error fetching drinks:", error);
            }
        };

        fetchDrinks();
    }, []);

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
        <div className="judo-app">
            {/* 추천 상품 */}
            {isAuthenticated && <RecommendedDrinks/>}
            
            <div className="drink-card-divider"></div>
            {/* 상품 리스트 */}
            <div className="drink-container">
                <h2>전체 상품</h2>
                <div className="drink-list">
                    {drinks.map((drink) => (
                        <DrinkCard 
                            key={drink.id}
                            drink={drink}
                            isFavorite={favorites.includes(drink.id)}  // 찜 상태 체크
                            isInCart={cartItems.includes(drink.id)}    // 장바구니 상태 체크
                            onToggleFavorite={() => toggleFavorite(drink.id)}
                            onToggleCart={() => toggleCart(drink.id)}
                            onGoToDetail={goToDetail}
                        />
                    ))}
                </div>`
            </div>
        </div>
    );
};

export default JudoApp;
