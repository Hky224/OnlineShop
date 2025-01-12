import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './Purchase.css';

function Purchase() {
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const { product, paymentMethod } = location.state ? location.state : { product: null, paymentMethod: '' };

    const paypalClientId = "AWtTZmzEMR92ZFrddQCeasMQBu9s1GzQud7XyjKJP28v0kWggSAvH_43kfIUeMZjQFifx2Z89cUsV3bh";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const purchaseInfo = {
            userName: name,
            address,
            phoneNumber,
            productName: product.name,
            productPrice: product.price,
            userEmail: localStorage.getItem('userEmail'),
            paymentMethod: paymentMethod
        };
        const response = await axios.post('http://localhost:3001/purchase', purchaseInfo);
        if (response.data.redirect) {
            alert("Purchase Completed");
            navigate('/');
        } else {
            alert(response.data.message);
        }
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: product.price.toString(),
                },
            }],
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(details => {
            alert("Payment Successful!");
            navigate('/');
        });
    };

    if (paymentMethod === 'PayPal') {
        return (
            <div>
                <NavBar />
                <div className="container mt-5">
                    <h2>Purchase Page</h2>
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="card-text">Price: ${product.price}</p>
                            <p>Payment Method: {paymentMethod}</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input type="text" className="form-control" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>
                    </form>
                    <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
                        <div className="paypal-container">
                            <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
                        </div>
                    </PayPalScriptProvider>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <NavBar />
                <div className="container mt-5">
                    <h2>Purchase Page</h2>
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="card-text">Price: ${product.price}</p>
                            <p>Payment Method: {paymentMethod}</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input type="text" className="form-control" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit Order</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Purchase;
