import React, { useState } from 'react';
import axios from 'axios';

const CancelOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [message, setMessage] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);

    const handleCancelOrder = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/order/cancel', {
                order_id: orderId,
                customer_id: customerId
            });
            setMessage(response.data.message);
            setOrderDetails(null); // Clear order details on successful cancel
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || 'Unexpected error'}`);
        }
    };

    const handleViewOrderDetails = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/order/details', {
                order_id: orderId
            });
            setOrderDetails(response.data);
            setMessage('');
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || 'Unexpected error'}`);
        }
    };

    return (
        <div className='order_container'>
            <h2>Order Management</h2>
            <input
                type="text"
                placeholder="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
            />
            <button onClick={handleViewOrderDetails}>View Order Details</button>
            <button onClick={handleCancelOrder}>Cancel Order</button>
            {message && <p>{message}</p>}
            {orderDetails && (
                <div className="order-details">
                    <h3>Order Details</h3>
                    {/* <p><strong>Customer ID:</strong> {orderDetails.customer_id}</p> */}
                    <p><strong>Product ID:</strong> {orderDetails.product_id}</p>
                    <p><strong>Product Name:</strong> {orderDetails.product_name}</p>
                    <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
                    <p><strong>Total Spend:</strong> ${orderDetails.total_spend}</p>
                </div>
            )}
        </div>
    );
};

export default CancelOrder;
