import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './common/AxiosInstance';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import './JudoApp.css';

// 찜하기와 장바구니 아이콘 이미지 경로
import favoriteIcon from '../assets/bookmark_clear.png'; // 찜하기 아이콘
import favoriteFilledIcon from '../assets/bookmark_blue.png'; // 찜하기 활성화 아이콘
import cartIcon from '../assets/cart.png'; // 장바구니 아이콘
import testImage from '../assets/test_image.png'; // 테스트 이미지

const JudoApp = () => {
    const [drinks, setDrinks] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    
    const { isAuthenticated } = useContext(AuthContext); // Get authentication status from context
    const navigate = useNavigate(); 

    // API 요청으로 주류 리스트 가져오기
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
                    const favoriteIds = response.data.map((item) => item.drinkId);
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

        // API 요청을 보내서 찜하기 상태 저장
        try {
            await axiosInstance.post('/api/wishlist/new', {
                drinkId,
                isFavorite: !isAlreadyFavorite
            });
            // 변경 사항 반영을 위해 화면 새로고침
            window.location.reload();
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    // 장바구니 추가 기능
    const toggleCart = async (drinkId) => {
        const isAlreadyInCart = cartItems.includes(drinkId);

        // API 요청을 보내서 장바구니 상태 저장
        try {
            await axiosInstance.post('/api/cart/new', {
                drinkId,
                isInCart: !isAlreadyInCart
            });
            alert("장바구니에 추가되었습니다.");
            // 변경 사항 반영을 위해 화면 새로고침
            window.location.reload();
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    // 세부 정보 화면으로 이동
    const goToDetail = (drinkId) => {
        navigate(`/drink/${drinkId}`); // Navigate to the drink detail page
    };

    return (
        <div className="judo-app">
            {/* 주류 리스트 */}
            <div className="drink-list">
                {drinks.map((drink) => (
                    <div key={drink.id} className="drink-card">
                        <img 
                            src={testImage} 
                            alt={drink.name} 
                            className="drink-image" 
                            onClick={() => goToDetail(drink.id)}
                        />
                        <div className="drink-details">
                            <h3>{drink.name}</h3>
                            <p>{drink.type} - {drink.abv}도</p>

                            {/* 찜하기 버튼 */}
                            <img
                                src={favorites.includes(drink.id) ? favoriteFilledIcon : favoriteIcon}
                                alt="찜하기"
                                className="icon"
                                onClick={() => toggleFavorite(drink.id)}
                            />

                            {/* 장바구니 버튼 */}
                            <img
                                src={cartIcon}
                                alt="장바구니"
                                className="icon"
                                onClick={() => toggleCart(drink.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JudoApp;
