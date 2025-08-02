import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/customer/signup', {
                first_name: firstName,
                city,
                state
            });
            setMessage(`Registered successfully. Your Customer ID is ${response.data.customer_id}`);
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className='login-wrapper'>
            <div className='login-container'>
            <h2>Sign Up</h2>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
            />
            <button onClick={handleSubmit}>Sign Up</button>

            {message && <p>{message}</p>}
          <a className='btn-signup' href="/customer-login">CustomerLogin</a> 
            </div>
        </div>
    );
};

export default SignUp;
