import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from 'react-use-cart';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
    const [productInfo, setProductInfo] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProductInfo(response.data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        if (productInfo) {
            // Add product to cart using the addItem method
            addItem({
                id: productInfo.product_id,
                title: productInfo.title,
                price: productInfo.price,
                quantity: 1,
            });
            alert('Product added to cart!');
        }
    };

    if (!productInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail">
            <h2>{productInfo.title}</h2>
            <img src={productInfo.image_url} alt={`${productInfo.title}`} />
            <p>Description: {productInfo.description}</p>
            <p>Date Posted: {new Date(productInfo.post_date).toDateString()}</p>
            <p>Category: {productInfo.category}</p>
            <p>Price: ${productInfo.price.toFixed(2)}</p>
            <p>Available: {productInfo.is_available ? "Yes" : "No"}</p>
            <button onClick={addToCart}>Add to Cart</button>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
};

export default ProductDetail;
