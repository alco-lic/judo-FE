import React from "react";
import DaumPostcode from "react-daum-postcode";
import './DaumPost.css'; // CSS 파일 불러오기

const DaumPost = ({ setAddress, handleComplete }) => {
    const complete = (data) => {
        const fullAddress = data.address; // 데이터에서 주소 추출
        const zonecode = data.zonecode; // 우편번호 추출

        setAddress({ 
            address: fullAddress, 
            zonecode: zonecode 
        }); // 객체 형태로 설정

        handleComplete(); // 팝업창 닫기
    };

    return (
        <div className="daum-post-background">
            <div className="daum-post-container">
                <h1 className="daum-post-title">주소 검색</h1>
                <button className="close-button" onClick={handleComplete}>✖</button> {/* 나가기 버튼 추가 */}
                <DaumPostcode
                    autoClose
                    style={{ width: "100%", height: "400px" }}
                    onComplete={complete}
                />
            </div>
        </div>
    );
};

export default DaumPost;
