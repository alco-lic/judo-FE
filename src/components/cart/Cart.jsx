import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get('/api/cart/all');
        setCartItems(response.data); // 응답 데이터를 cartItems로 설정
      } catch (error) {
        setError('Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = () =>
    parseFloat(cartItems.reduce((total, item) => total + item.price, 0)).toFixed(2);

const handlePayment = () => {
    if(cartItems.length === 0){
        alert("장바구니에 상품이 존재하지 않습니다.")
    } else {
        navigate('/payment', {
            state: {
            cartItems: cartItems,
            totalAmount: calculateTotal(),
            },
        });
    }
};
      

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <h2>{item.name}</h2>
                  <p>Price: ${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <p>Total Items: {cartItems.length}</p>
          <p>Total Price: ${calculateTotal()}</p>
          <button className="pay-button" onClick={handlePayment}>결제하기</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
