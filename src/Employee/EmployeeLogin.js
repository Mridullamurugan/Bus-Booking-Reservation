import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const EmployeeLogin = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeePassword, setEmployeePassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/employee/login', {
                employee_name: employeeName,
                employee_password: employeePassword
            });
            if (response.data.success) {
                setMessage(response.data.message);
                // Navigate to the employee products page immediately after login
                navigate('/Emp_products');
            } else {
                setMessage(response.data.error);
            }
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="employee-login">
                <h2>Employee Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="employeeName">Employee Name:</label>
                        <input
                            type="text"
                            id="employeeName"
                            value={employeeName}
                            onChange={(e) => setEmployeeName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="employeePassword">Password:</label>
                        <input
                            type="password"
                            id="employeePassword"
                            value={employeePassword}
                            onChange={(e) => setEmployeePassword(e.target.value)}
                            required
                        />
                    </div>
                    <button onClick={handleLogin} type="submit">Login</button>
                    <a className='btn-signup' href="/customer-login">Customer Login</a>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default EmployeeLogin;
