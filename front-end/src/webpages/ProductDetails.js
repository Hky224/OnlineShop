import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../components/NavBar';

function ProductDetail() {
    const [product, setProduct] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');
    const { productId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await axios.get(`https://onlineshop-backend-bspd.onrender.com/products/${productId}`);
            setProduct(response.data);
        };
        fetchProduct();
    }, [productId]);

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleBuyNowClick = () => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            alert('Please login to proceed');
        } else if (!paymentMethod) {
            alert('Please select a payment method to proceed');
        } else {
            navigate('/purchase', { state: { product: product, paymentMethod: paymentMethod } });
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <img src={`https://onlineshop-backend-bspd.onrender.com/uploads/${product.image}`} alt={product.name} className="img-fluid" />
                    </div>
                    <div className="col-md-6">
                        <h2 className="card-title">{product.name}</h2>
                        <p className="card-text">${product.price}</p>
                        {product.type === 'discount' && <span className="badge bg-danger mb-2">Discount</span>}

                        <select className="form-select mt-3" value={paymentMethod} onChange={handlePaymentChange}>
                            <option value="" >Select Payment Method</option>
                            <option value="Pay on Arrival">Pay on Arrival</option>
                            <option value="PayPal">PayPal</option>
                        </select>

                        <button className="btn btn-primary btn-lg mt-4" onClick={() => navigate('/contact', { state: { product: product } })}>Contact</button>
                        <button className="btn btn-success btn-lg ms-2 mt-4" onClick={handleBuyNowClick}>Buy Now</button>
                    </div>
                </div>
                <hr></hr>
                <div>
                    <h3 className="product-description">Product Description</h3>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
