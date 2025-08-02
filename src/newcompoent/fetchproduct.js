import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceOrder from '../newcompoent/placeorder';
import CancelOrder from '../newcompoent/cancelorder';
// import './FetchProducts.css'; // Importing the CSS file

const FetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                if (error.response && error.response.data) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="FetchProducts"> {/* Add className here */}
            <h2>Products</h2>

            {error && <p>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>productId</th>
                        <th>productName</th>
                        {/* <th>productQuantity</th> */}
                        <th>productPrice</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>
                            <td>{product.product_name}</td>
                            {/* <td>{product.product_quantity}</td> */}
                            <td>{product.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <PlaceOrder />
            <CancelOrder />
            {/* <PlaceOrder /> */}
        </div>
    );
};

export default FetchProducts;
