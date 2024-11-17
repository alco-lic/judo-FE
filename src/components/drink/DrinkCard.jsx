// DrinkCard.js
import React from 'react';
import favoriteIcon from '../../assets/bookmark_clear.png'; // 찜하기 아이콘
import favoriteFilledIcon from '../../assets/bookmark_blue.png'; // 찜하기 활성화 아이콘
import cartIcon from '../../assets/cart.png'; // 장바구니 아이콘
import testImage from '../../assets/test_image.png'; // 테스트 이미지
import './DrinkCard.css'

const DrinkCard = ({ drink, isFavorite, isInCart, onToggleFavorite, onToggleCart, onGoToDetail }) => {
    return (
        <div className="drink-card">
            <img 
                src={testImage} 
                alt={drink.name} 
                className="drink-image" 
                onClick={() => onGoToDetail(drink.id)}
            />
            <div className="drink-details">
                <h3>{drink.name}</h3>
                <p>{drink.type} - {drink.abv}도</p>

                {/* 찜하기 버튼 */}
                <img
                    src={isFavorite ? favoriteFilledIcon : favoriteIcon}
                    alt="찜하기"
                    className="icon"
                    onClick={() => onToggleFavorite(drink.id)}
                />

                {/* 장바구니 버튼 */}
                <img
                    src={cartIcon}
                    alt="장바구니"
                    className="icon"
                    onClick={() => onToggleCart(drink.id)}
                />
            </div>
        </div>
    );
};

export default DrinkCard;
