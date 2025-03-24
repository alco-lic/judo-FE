# 📝 JUDO

2030을 대상으로 하는 주류 추천 서비스입니다.  
Spring Boot와 Kotlin을 활용하여 백엔드를 개발하고, React를 통해 프론트엔드를 구축하였습니다.  
주소 검색, 결제 시스템, 음료 추천 등 다양한 기능을 제공합니다.

---

## 🌟 주요 기능

✅ **주소 찾기 (Address Search)**: Daum Postcode API를 사용하여 주소를 검색하고 실시간으로 화면에 반영  
✅ **결제 시스템 (Payment System)**: PortOne API를 활용하여 카드 결제, 계좌이체, 간편결제 등 다양한 결제 수단 지원  
✅ **음료 추천 시스템 (Drink Recommendation System)**: KNN 알고리즘을 사용하여 사용자의 맛 프로필을 기반으로 음료 추천  
✅ **배포 (Deployment)**: 자동화된 배포 프로세스를 통해 서버에서 코드 변경 시 즉시 배포  

---

## 👨‍💻 개발자 소개

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/67574367?s=150&v=4" alt="조승빈" width="150">
  <br>
  <strong>조승빈</strong>
  <br>
  Backend & Frontend 개발
  <br>
  🔗 <a href="https://github.com/vkflco08">GitHub 프로필</a>
</div>

---

## 🚀 프로젝트 개요
- **프레임워크**: React (JSX)
- **프론트엔드 개발 환경**: `React 18`, `react-scripts 5.0.1`
- **배포 방식**: 개인 리눅스 서버에서 Jenkins를 활용하여 Nginx 컨테이너를 배포  
- **백엔드 GitHub**: [BE GitHub Repository](https://github.com/alco-lic/judo-BE)

---

## 📌 사용된 기술 및 라이브러리

📦 주요 라이브러리
- `@portone/browser-sdk` (v^0.0.10): PortOne 결제 시스템 SDK
- `axios` (v^1.7.7): HTTP 요청을 위한 라이브러리
- `chart.js` (v^4.4.6): 차트 라이브러리
- `date-fns` (v^3.6.0): 날짜 처리 라이브러리
- `react` (v^18.3.1): React 라이브러리
- `react-chartjs-2` (v^5.2.0): React에서 Chart.js 사용을 위한 라이브러리
- `react-daum-postcode` (v^3.1.3): Daum 우편번호 서비스 React 컴포넌트
- `react-router-dom` (v^6.26.1): React에서 라우팅을 위한 라이브러리
- `react-scripts` (v^5.0.1): Create React App을 사용한 스크립트 관리
- `styled-components` (v^6.1.13): 스타일 컴포넌트 관리 라이브러리
- `recharts` (v^2.13.3): React 차트 라이브러리

---

## 🚀 배포 방식
- **GitHub 푸시**: 코드 변경 사항을 GitHub에 푸시하면 Webhook이 작동합니다.
- **Jenkins 실행**: 개인 리눅스 서버의 Jenkins가 Webhook을 통해 빌드를 트리거합니다.
- **Nginx 컨테이너 배포**: Jenkins 스크립트에서 Nginx 컨테이너를 생성하여 최신 빌드를 배포합니다.

---

## 📞 연락처
- **Email**: [vkflco8080@gmail.com](mailto:vkflco8080@gmail.com)
