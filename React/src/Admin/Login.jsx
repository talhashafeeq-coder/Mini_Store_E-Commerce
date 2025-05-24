import React, { useState, useEffect } from "react";
import "../Style/Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // 📌 Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); 
    }
  }, [navigate]);

  // 📌 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/user/api/login/v1",
        formData
      );
      localStorage.setItem("token", response.data.access_token); // Save token to localStorage
      setMessage({ type: "success", text: response.data.message || "Login successful!" });
      setTimeout(() => navigate("/"), 1500); // Redirect after 1.5s
    } catch (error) {
      let errorMsg = "Login failed! Please try again.";
      if (error.response) {
        errorMsg = error.response.data.message || "Invalid credentials!";
      } else if (error.request) {
        errorMsg = "No response from server. Check your internet connection.";
      } else {
        errorMsg = "Something went wrong. Try again later.";
      }
      setMessage({ type: "danger", text: errorMsg });
    }
  };

  return (
    <div className="container-fluid banner d-flex flex-column justify-content-center align-items-center">
      <h4 className="text-center bg-dark text-light mb-2">Hey there! Welcome back!</h4>
      <p className="login-message">
        Log in to access your cart and stay connected.
        <Link to="/register"> Need an account?</Link> Login now!
      </p>

      <div className="login-box">
        <h2>Login</h2>
        {message.text && (
          <div className={`alert alert-${message.type} mt-3`}>{message.text}</div>
        )}
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
          <button type="submit" className="btn button">Login</button>
          <button type="button" className="btn button2 ms-2" onClick={() => navigate("/register")}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
