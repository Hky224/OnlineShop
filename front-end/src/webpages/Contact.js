import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import './Contact.css';
import Navbar from '../components/NavBar';

function Contact() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const location = useLocation();
    const product = location.state?.product;

    const sendMessage = async () => {
        setInput('');
        if (input.trim() === '') return;
        const productInfo = product ? `Here is the product information:\nName: ${product.name}\nPrice: ${product.price}\nDescription: ${product.description}\n\n` : '';
        const finalMessage = productInfo + input;
        const newUserMessage = { role: 'user', content: input };
        setMessages([...messages, newUserMessage]);
        const response = await axios.post('https://online-shopapi.vercel.app/chat', { message: finalMessage });
        const newAIResponse = { role: 'ai', content: response.data.result };
        setMessages(messages => [...messages, newAIResponse]);
        setInput('');
    };

    return (
        <div>
            <Navbar/>
            <div>
            {product && (
                <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                    <p>{product.description}</p>
                </div>
            )}
        </div>
            <div className="container my-3">
                <div className="chat-box border rounded p-3" style={{ height: '400px', overflowY: 'auto' }}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role === 'user' ? 'message-user' : 'message-ai'} ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
                            <p>
                                {msg.content}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="input-group my-3">
                    <input type="text" className="form-control" placeholder="Enter your message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
                    <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Contact;
