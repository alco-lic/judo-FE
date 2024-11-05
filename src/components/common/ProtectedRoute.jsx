import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    alert("로그인이 필요합니다."); // 로그인 필요 알림
    return <Navigate to="/login" />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;
