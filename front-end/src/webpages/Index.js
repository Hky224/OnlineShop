import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/NavBar.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Index.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

function Index() {
    const [discountProducts, setDiscountProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const sliderRef = useRef(null);
    const navigate = useNavigate();

  useEffect(() => {
    document.title = "Imagineering beauty shop";
    const fetchProducts = async () => {
      const response = await axios.get('http://localhost:3001/products');
      const allProducts = response.data;
      const uniqueDiscountProducts = [];
      const seenIds = new Set();

      allProducts.forEach((product) => {
        if (product.type === 'discount' && !seenIds.has(product._id)) {
          uniqueDiscountProducts.push(product);
          seenIds.add(product._id);
        }
      });
      setDiscountProducts(uniqueDiscountProducts);
      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      },      
    ]
  };
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="discount-slider">
        <span className="badge bg-danger mb-3 bg-4">Discount</span>
          <Slider ref={sliderRef} {...settings}>
            {discountProducts.map((product) => (
              <div key={product._id}>
                <img src={`http://localhost:3001/uploads/${product.image}`} alt={product.name} className='slider-img'/>
                <h5>{product.name}</h5>
                <p>${product.price}</p>
              </div>
            ))}
          </Slider>
        </div>
        
        <div className="row mt-4">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card product-box">
                <img src={`http://localhost:3001/uploads/${product.image}`} alt={product.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price}</p>
                  {product.type === 'discount' && <span className="badge bg-danger mb-2">Discount</span>}
                  <br></br>
                  <button className="btn btn-primary" onClick={() => navigate(`/product/${product._id}`)}>Purchase</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Index;
