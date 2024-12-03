import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from 'react-use-cart'; // Import CartProvider
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import PostItemForm from './components/PostItemForm';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import AccountInfo from './components/AccountInfo';
import Cart from './components/Cart';
import { AuthProvider } from "./components/AuthContext";
import Checkout from "./components/Checkout";
function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [userId, setUserId] = useState(null);

    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Header
                        onLoginClick={() => setShowLogin(true)}
                        onRegisterClick={() => setShowRegister(true)}
                        setShowPost={setShowPost}
                        setUserId={setUserId}
                    />
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/account" element={<AccountInfo userId={userId} />} />
                        <Route path="/post-item" element={<PostItemForm isOpen={showPost} onClose={() => setShowPost(false)} />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                    <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} setUserId={setUserId} />
                    <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
