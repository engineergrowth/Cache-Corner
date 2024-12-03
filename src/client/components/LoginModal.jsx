import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from './AuthContext';
import '../styles/LoginModal.css';

const LoginModal = ({ isOpen, onClose, setUserId }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('https://cache-corner.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful:", data);
                console.log(data.user.user_id);                
                login(data.token);
                setUserId(data.user.user_id);
                onClose();
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login.');
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="loginModal" contentLabel="Login">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                {error && <div className="error-message">{error}</div>}
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default LoginModal;
