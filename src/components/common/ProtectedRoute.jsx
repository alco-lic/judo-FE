import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    alert("로그인이 필요합니다."); // Alert message for unauthenticated users
    return <Navigate to="/login" />;
  }

  return Component; // Return the protected component if authenticated
};

export default ProtectedRoute;
