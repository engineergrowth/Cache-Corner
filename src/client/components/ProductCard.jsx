import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';
const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleMoreInfoClick = () => {
        navigate(`/product/${product.product_id}`);
    };

    return (
        <div className="product-card">
            <img src={product.image_url} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price.toFixed(2)}</p>
            <button onClick={handleMoreInfoClick}>View</button>
        </div>
    );
}

export default ProductCard;
