import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false); // 페이지 이동 시 서랍 닫기
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">judo</Link>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="navbar-link">Wishlist</Link>
              <Link to="/cart" className="navbar-link">Cart</Link>
              <button onClick={toggleDrawer} className="navbar-drawer-button">☰</button>
              <div className={`drawer-menu ${isDrawerOpen ? 'open' : ''}`}>
                <Link to="/payment/history" className="drawer-link" onClick={closeDrawer}>결제 내역 보기</Link>
                <div className="navbar-divider"></div>
                <Link to="/profile" className="drawer-link" onClick={closeDrawer}>내 정보 보기</Link>
                <Link to="/" className="drawer-link" onClick={() => { logout(); closeDrawer(); }}>Logout</Link>
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
