import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // sidebar가 열려 있고 클릭한 곳이 sidebar와 sidebar-toggle-button이 아닌 경우
      if (
        sidebarOpen &&
        !event.target.closest('.drawer-menu') &&
        !event.target.closest('.navbar-drawer-button')
      ) {
        setSidebarOpen(false);
      }
    };

    // 마운트 시 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);

    // 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">judo</Link>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/knn" className="navbar-link">Keyword</Link>
              |
              <Link to="/wishlist" className="navbar-link">Wishlist</Link>
              |
              <Link to="/cart" className="navbar-link">Cart</Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="navbar-drawer-button"
              >
                ☰
              </button>
              <div className={`drawer-menu ${sidebarOpen ? 'open' : ''}`}>
                <button
                  className="drawer-link"
                  onClick={() => handleLinkClick('/payment/history')}
                >
                  결제 내역 보기
                </button>
                <div className="navbar-divider"></div>
                {/* <button
                  className="drawer-link"
                  onClick={() => handleLinkClick('/profile')}
                >
                  내 정보 보기
                </button> */}
                <button
                  className="drawer-link"
                  onClick={() => {
                    logout();
                    handleLinkClick('/');
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
