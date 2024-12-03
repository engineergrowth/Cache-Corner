import React from 'react';
import { useCart } from 'react-use-cart';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const {
        isEmpty,
        totalUniqueItems,
        items,
        totalItems,
        cartTotal,
        updateItemQuantity,
        removeItem,
        emptyCart,
    } = useCart();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (isEmpty) return <p>Your cart is empty</p>;

    return (
        <section className="cart-container">
            <h2>Cart ({totalUniqueItems}) total items: ({totalItems})</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <div className="item-info">
                            <strong>{item.title}</strong> ({item.quantity}) - <strong>${item.itemTotal.toFixed(2)}</strong>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                            <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                            <button onClick={() => removeItem(item.id)}>Remove Item</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="checkout-section">
                <p><strong>Total: ${cartTotal.toFixed(2)}</strong></p>
                <div className="action-buttons">
                    <button onClick={handleCheckout} className="checkout-button">Checkout</button>
                    <button onClick={() => emptyCart()} className="clear-btn">Clear Cart</button>
                </div>
            </div>
        </section>
    );
};

export default Cart;

