import React, { useState } from 'react';
import axios from 'axios';


const PlaceOrder = () => {
    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');

   const handleSubmit = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/order', {
            customer_id: customerId,
            product_id: productId,
            quantity: Number(quantity)  // Convert quantity to a number
        });

        // Check if the response contains order_id
        if (response.data.success) {
            setMessage(`Order placed successfully. Order ID: ${response.data.order_id}`);
        } else {
            setMessage(`Error: ${response.data.error}`);
        }
    } catch (error) {
        setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
};

    return (
        <div className='prt_container'>
            <h2>Place Order</h2>
            <input 
                type="text" 
                placeholder="Customer ID" 
                value={customerId} 
                onChange={(e) => setCustomerId(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Product ID" 
                value={productId} 
                onChange={(e) => setProductId(e.target.value)} 
            />
            <input 
                type="number" 
                placeholder="Quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
            />
            <button onClick={handleSubmit}>Place Order</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PlaceOrder;
