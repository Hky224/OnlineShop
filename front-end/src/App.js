import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './webpages/Index';
import Login from './webpages/Login';
import Register from './webpages/Register';
import CreateProduct from './webpages/CreateProduct';
import ProductDetails from './webpages/ProductDetails';
import Purchase from './webpages/Purchase';
import Contact from './webpages/Contact';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/product/:productId" element={<ProductDetails />} /> 
          <Route path="/purchase" element={<Purchase />} /> 
          <Route path="/contact" element={<Contact />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
