import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LogIn = () => {
    const [customerId, setCustomerId] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/customer/login', {
                customer_id: customerId
            });

            if (response.data.message && !response.data.error) {
                setMessage(response.data.message);
                // Add a 2-second delay before navigating to the products page
                setTimeout(() => {
                    navigate('/products');
                }, 2000);
            } else {
                setMessage(response.data.message || "An error occurred");
            }
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>Log In</h2>
                <input
                    type="text"
                    placeholder="Customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                />
                <br />
                <button onClick={handleSubmit} disabled={loading}>Log In</button>
                
                {loading && <div className="loading">Loading...</div>}
                
                <a className='btn-signup' href="/customer-signup">Customer Sign Up</a>
                <a className='btn-signup' href="/Emp_login">Employee Login</a>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default LogIn;
