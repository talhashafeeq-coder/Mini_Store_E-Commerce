import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/Login.css';


const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'customer',
        address: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/user/api/register/v1', formData);
            setMessage(response.data.message);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container-fluid banner d-flex flex-column  justify-content-center align-items-center">
            <h4 className="text-center bg-dark text-light mb-2">Hey there! Welcome back!</h4>
            <p className="login-message">
  Create an account to explore more features and stay connected.
   <Link to="/login"> Already have an account? </Link>  Log in now!
</p>
            <div className="login-box">

                <form onSubmit={handleSubmit}>
                    <div className="user-box">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <label>Username</label>
                    </div>
                    <div className="user-box">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <label>Password</label>

                    </div>
                    <div className="user-box">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label >Email</label>
                        <div className="user-box">
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        <label >Address</label>

                    </div>
                    </div>
                        <select
                            className="form-control"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>

                    
                    
                    <button type="submit" className="btn button2 mt-3">Register</button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
        </div>
    );
};

export default Register;