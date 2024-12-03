import axios from 'axios';
import { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/PostItemForm.css';

const PostItemForm = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const { user_id } = useAuth();
    const navigate = useNavigate();

    const categories = [
        'Clothing',
        'Furniture',
        'Books',
        'Electronics',
        'Toys & Games',
        'Art & Decor',
        'Kitchenware',
        'Sporting Goods',
        'Miscellaneous'
    ];

    const handlePostItem = async (event) => {
        event.preventDefault();
        setError('');

        if (!title || !description || !price) {
            setError('Please fill in all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', parseFloat(price));
        formData.append('category', category);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            formData.append('user_id', user_id);  // Append user_id to the form data

            await axios.post(
                'https://cache-corner.onrender.com/api/products',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onClose(); // Close the modal
            navigate('/'); // Navigate to the home page or to the products list
        } catch (error) {
            setError(error?.response?.data?.message || 'An error occurred during posting.');
            console.error('Posting error:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="PostItemForm">
            <h2>Sell your item:</h2>
            <form onSubmit={handlePostItem}>
                {error && <div className="error-message">{error}</div>}
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select a Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
                <button type="submit">Post Item</button>
            </form>
        </Modal>
    );
};

export default PostItemForm;