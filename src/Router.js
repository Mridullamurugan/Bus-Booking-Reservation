import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import SignUp from '../src/newcompoent/sinup';
import LogIn from '../src/newcompoent/login';
import FetchProducts from '../src/newcompoent/fetchproduct';
import PlaceOrder from '../src/newcompoent/placeorder';
import CancelOrder from '../src/newcompoent/cancelorder';
import EmployeeProduct from '../src/Employee/Productsnew'
import EmpLogin from '../src/Employee/EmployeeLogin'
const App = () => {
    return (
        <Router>
            <div>
                {/* <nav>
                    <ul>
                        <li>
                            <Link to="/customer-signup">Customer Sign Up</Link>
                        </li>
                        <li>
                            <Link to="/customer-login">Customer Login</Link>
                        </li>
                        <li>
                            <Link to="/products">Products</Link>
                        </li>
                        <li>
                            <Link to="/place-order">Place Order</Link>
                        </li>
                        <li>
                            <Link to="/cancel-order">Cancel Order</Link>
                        </li>
                    </ul>
                </nav> */}
                <Routes>
                    <Route path="/" element={<Navigate to="/customer-login" />} />
                    <Route path="/customer-signup" element={<SignUp />} />
                    <Route path="/customer-login" element={<LogIn />} />
                    <Route path="/products" element={<FetchProducts />} />
                    
                    <Route path="/place-order" element={<PlaceOrder />} />
                    <Route path="/cancel-order" element={<CancelOrder />} />
                    <Route path="/Emp_login" element={<EmpLogin />} />
                    <Route path="/Emp_products" element={<EmployeeProduct />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
