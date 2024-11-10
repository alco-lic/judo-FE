// Wishlist.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';

import testImage from '../../assets/test_image.png'; // 테스트 이미지

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // 백엔드에서 찜한 목록 데이터를 가져오는 함수
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get('/api/wishlist/all');
        setWishlist(response.data);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  // 세부 정보 화면으로 이동
  const goToDetail = (drinkId) => {
    navigate(`/drink/${drinkId}`);
  };

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div 
            key={item.id} 
            className="wishlist-item"
            onClick={() => goToDetail(item.drink.id)}
          >
            <img src={testImage} alt={item.drink.name} className="wishlist-image" />
            <div className="wishlist-details">
              <h3>{item.drink.name}</h3>
              <p>Type: {item.drink.type}</p>
              <p>ABV: {item.drink.abv}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
