import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import '../styles/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch('https://cache-corner.onrender.com/api/products')
            .then(response => response.json())
            .then(data => {
                console.log("Fetched products:", data);
                const filteredProducts = data.filter(product =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setProducts(filteredProducts);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [searchQuery]);

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    return (
        <div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="product-list-container">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.product_id} product={product} />
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;
