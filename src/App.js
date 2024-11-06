import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/login/Login';
import SignUp from './components/login/SignUp';
import NavBar from './components/common/NavBar';
import JudoApp from './components/JudoApp'; 
import DrinkDetail from './components/drinkDetail/DrinkDetail';
import Cart from './components/cart/Cart';
import Payment from './components/payment/Payment';
import PaymentHistory from './components/payment/PaymentHistory';

function App() {
    return (
        <Router>
            {/* NavBar is outside the Routes so it appears on every page */}
            <NavBar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Main page accessible without signup */}
                <Route path="/" element={<JudoApp />} />

                {/* Protected routes */}
                <Route path="/protected" element={<ProtectedRoute />} />
                
                <Route path="/drink/:id" element={<DrinkDetail />} />

                {/* Cart route, protected */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>}/>
                <Route path="/payment" element={<ProtectedRoute><Payment /> </ProtectedRoute>}/>
                <Route path="/payment/history" element={<ProtectedRoute><PaymentHistory /> </ProtectedRoute>}/>
                
            </Routes>
        </Router>
    );
}

export default App;
