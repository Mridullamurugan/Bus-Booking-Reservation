import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products');
            setProducts(response.data);
        } catch (error) {
            setMessage('Failed to fetch products');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/product/add', {
                product_name: productName,
                price: price,
                quantity: quantity
            });
            setMessage(response.data.message);
            if (response.data.success) {
                // Fetch and update the list of products
                fetchProducts();
                // Clear the form fields
                setProductName('');
                setPrice('');
                setQuantity('');
            }
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
                <div>
                    <label htmlFor="productName">Product Name:</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
            {message && <p>{message}</p>}
            
            <h3>Product List</h3>
            {products.length > 0 ? (
                <ul>
                    {products.map(product => (
                        <li key={product.product_id}>
                            {product.product_name} - ${product.price} - Quantity: {product.product_quantity}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
};

export default AddProduct;
