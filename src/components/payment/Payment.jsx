import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as PortOne from "@portone/browser-sdk/v2"; 
import axiosInstance from '../common/AxiosInstance'; 
import './Payment.css'; 
import DaumPost from './DaumPost';

const Payment = () => {
    const location = useLocation();
    const { cartItems, totalAmount } = location.state || { cartItems: [], totalAmount: 0 };
    const [address, setAddress] = useState({ address: '', zonecode: '' });
    const [detailedAddress, setDetailedAddress] = useState('');
    const [popup, setPopup] = useState(false);

    const handlePayment = () => {
        const paymentData = {
            storeId: process.env.REACT_APP_TOSSPAYMENTS_STOREID,
            paymentId: `payment-${crypto.randomUUID()}`,
            orderName: "장바구니 상품",
            totalAmount: parseFloat(totalAmount),
            currency: "CURRENCY_KRW",
            channelKey: process.env.REACT_APP_TOSSPAYMENTS_CHANNELKEY,
            payMethod: "CARD",
            address: address.address + (detailedAddress ? `, ${detailedAddress}` : ''),
        };

        PortOne.requestPayment(paymentData)
            .then(response => {
                savePaymentToBackend(response);
            })
            .catch(error => {
                console.error("결제 실패:", error);
            });
    };

    const savePaymentToBackend = async (paymentResponse) => {
        const orderData = {
            paymentId: paymentResponse.paymentId,
            transactionType: paymentResponse.transactionType,
            txId: paymentResponse.txId,
            totalAmount: totalAmount,
            items: cartItems.map(item => ({
                id: item.id,
                drinkId: item.drinkId,
                quantity: 1,
                name: item.name,
                price: item.price
            })), 
            address: address.address + (detailedAddress ? `, ${detailedAddress}` : ''),
        };

        try {
            const response = await axiosInstance.post('/api/orders/create', orderData);
            console.log("백엔드에 결제 내역 저장 성공:", response);
        } catch (error) {
            console.error("백엔드 저장 실패:", error);
            alert("결제에 실패했습니다.", error);
            window.location.reload();
        }
    };

    const handleComplete = () => {
        setPopup(!popup);
    };

    const handleAddressInputFocus = () => {
        setPopup(true);
    };

    // 주소가 입력된 경우와 장바구니에 상품이 있는 경우에만 결제 버튼 활성화
    const isPaymentButtonDisabled = !address.address.trim() || totalAmount === 0;

    return (
        <div className="payment-container">
            <h2 className="payment-title">결제하기</h2>
            <div className="address-input">
                <label className="address-label">주소:</label>
                <input
                    type="text"
                    value={address.address}
                    onFocus={handleAddressInputFocus}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    required
                    className="address-input-field"
                />
                <button onClick={handleComplete} className="address-search-button">주소 검색</button>
            </div>
            <div className="zonecode-display">
                <span className="zonecode-text">우편번호: {address.zonecode}</span>
            </div>
            <div className="detailed-address-input">
                <label className="detailed-address-label">상세 주소:</label>
                <input
                    type="text"
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    placeholder="상세 주소를 입력하세요"
                    className="detailed-address-input-field"
                />
            </div>
            <hr className="divider" />
            <h3 className="order-item-title">주문 상품</h3>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <p className="cart-item-text">{item.name} - ₩{item.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <h4 className="total-amount">총액: ₩{parseFloat(totalAmount).toFixed(2)}</h4>
            <button 
                onClick={handlePayment} 
                className="payment-button"
                disabled={isPaymentButtonDisabled} // 주소가 없거나 장바구니가 비어있으면 비활성화
            >
                결제하기
            </button>
            {popup && <DaumPost setAddress={setAddress} handleComplete={handleComplete} />}
        </div>
    );
};

export default Payment;
