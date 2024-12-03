import React, { createContext, useState, useEffect, useContext } from 'react';
import { useCart } from 'react-use-cart';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user_id, setUserId] = useState(null);

    // Integration with react-use-cart
    const {
        isEmpty,
        totalUniqueItems,
        items,
        totalItems,
        cartTotal,
        addItem,
        updateItemQuantity,
        removeItem,
        emptyCart,
    } = useCart();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('user_id');
        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(parseInt(storedUserId, 10)); // Make sure this is a number
        }
    }, []);
    const login = (token, userId) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', userId);
        setIsLoggedIn(true);
        setUserId(parseInt(userId, 10));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setIsLoggedIn(false);
        setUserId(null);
        emptyCart(); // Clear the cart on logout
    };

    const registerSuccess = (token, userId) => {
        login(token, userId.toString());
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            user_id,
            login,
            logout,
            registerSuccess,
            // Cart-related values and functions from react-use-cart
            isEmpty,
            totalUniqueItems,
            items,
            totalItems,
            cartTotal,
            addItem,
            updateItemQuantity,
            removeItem,
            emptyCart,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};