import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as PortOne from "@portone/browser-sdk/v2"; 
import axiosInstance from '../common/AxiosInstance'; 
import './Payment.css'; 
import DaumPost from './DaumPost';

const Payment = () => {
    const location = useLocation();
    const { cartItems, totalAmount } = location.state || { cartItems: [], totalAmount: 0 }; // 디폴트 값 설정
    const [address, setAddress] = useState({ address: '', zonecode: '' }); // 객체 형태로 상태 설정
    const [detailedAddress, setDetailedAddress] = useState(''); // 상세 주소 상태 추가
    const [popup, setPopup] = useState(false);

    // address 상태가 바뀔 때마다 로그 출력
    useEffect(() => {
    }, [address]); // address가 변경될 때마다 실행

    const handlePayment = () => {
        const paymentData = {
            storeId: process.env.REACT_APP_TOSSPAYMENTS_STOREID,
            paymentId: `payment-${crypto.randomUUID()}`,
            orderName: "장바구니 상품",
            totalAmount: parseFloat(totalAmount), // 숫자로 변환
            currency: "CURRENCY_KRW",
            channelKey: process.env.REACT_APP_TOSSPAYMENTS_CHANNELKEY,
            payMethod: "CARD", // 결제 수단
            address: address.address + (detailedAddress ? `, ${detailedAddress}` : ''), // 상세 주소 추가
        };

        PortOne.requestPayment(paymentData) // SDK 결제 요청
            .then(response => {
                savePaymentToBackend(response); // 결제 성공 시 백엔드에 결제 데이터 저장
            })
            .catch(error => {
                // 결제 실패 처리
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
                quantity: 1, // 기본값으로 1 설정
                name: item.name,
                price: item.price
            })), 
            address: address.address + (detailedAddress ? `, ${detailedAddress}` : ''),
        };

        try {
            const response = await axiosInstance.post('/api/orders/create', orderData);
            
            // 추가적인 성공 처리
        } catch (error) {
            console.error("백엔드 저장 실패:", error);
            alert("결제에 실패했습니다.", error)
            window.location.reload();
            
        }
    };

    const handleComplete = () => {
        setPopup(!popup); // 팝업창 상태 변경
    };

    // 주소 입력 필드 클릭 시 검색 이벤트 호출
    const handleAddressInputFocus = () => {
        setPopup(true); // 팝업창 열기
    };

    // 주소가 입력된 경우에만 결제 버튼 활성화
    const isPaymentButtonDisabled = !address.address.trim();

    return (
        <div className="payment-container">
            <h2 className="payment-title">결제하기</h2>
            <div className="address-input">
                <label className="address-label">주소:</label>
                <input
                    type="text"
                    value={address.address} // 주소 상태에서 주소만 사용
                    onFocus={handleAddressInputFocus} // 입력창 클릭 시 주소 검색
                    onChange={(e) => setAddress({ ...address, address: e.target.value })} // 주소 업데이트
                    required
                    className="address-input-field" // 클래스 추가
                />
                <button onClick={handleComplete} className="address-search-button">주소 검색</button>
            </div>
            <div className="zonecode-display">
                <span className="zonecode-text">우편번호: {address.zonecode}</span> {/* 우편번호 표시 */}
            </div>
            <div className="detailed-address-input">
                <label className="detailed-address-label">상세 주소:</label>
                <input
                    type="text"
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    placeholder="상세 주소를 입력하세요"
                    className="detailed-address-input-field" // 클래스 추가
                />
            </div>
            <hr className="divider" /> {/* 가로선 추가 */}
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
                disabled={isPaymentButtonDisabled} // 주소가 없으면 비활성화
            >
                결제하기
            </button>
            {popup && <DaumPost setAddress={setAddress} handleComplete={handleComplete}/>}
        </div>
    );
};

export default Payment;
