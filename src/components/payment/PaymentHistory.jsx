import React, { useEffect, useState } from 'react';
import axiosInstance from '../common/AxiosInstance'; // 커스텀 axios 인스턴스 불러오기
import './PaymentHistory.css'; // 스타일을 위한 CSS 파일

const PaymentHistory = () => {
    const [historyItems, setHistoryItems] = useState([]); // 결제 내역 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await axiosInstance.get('/api/orders/history');
                // console.log(response.data.data)
                setHistoryItems(response.data.data);
            } catch (error) {
                setError("결제 내역을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentHistory();
    }, []);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="payment-history-container">
            <h2 className="title">결제 내역</h2>
            {historyItems.length === 0 ? (
                <p>결제 내역이 없습니다.</p>
            ) : (
                <div className="history-list">
                    {historyItems.map((item, index) => (
                        <div key={index} className="history-item">
                            <h3 className="product-name">{item.product.name}</h3>
                            <p className="amount">결제 금액: ${item.amount.toLocaleString()}</p>
                            <p className="transaction-type">거래 타입: {item.transactionType}</p>
                            <p className="total-amount">총 결제 금액: ${item.totalAmount.toLocaleString()}</p>
                            <p className="address">배송 주소: {item.address}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
