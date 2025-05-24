import React, { useState, useEffect } from 'react';
import Check_userlogin from '../hooks/Check_userlogin';
import axios from 'axios';
import JwttokenGet from "../hooks/JwttokenGet";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function OrderList() {
    const [cartItems, setCartItems] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [formData, setFormData] = useState({
        shippingAddress: '',
        billingAddress: '',
        paymentMethod: ''
    });

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/shoppingcard/api/shoppingCard/v1');
            if (response.data.length > 0) {
                setCartItems(response.data[0].items);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/order/api/order/v1');
            console.log("order DATA", response.data);
            setOrderList(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = JwttokenGet();
    
        if (!userId) {
            alert("Please log in to place an order.");
            return;
        }
    
        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add products before placing an order.");
            return;
        }

        console.log("Final formData before submitting:", formData); // Debugging log

        const orderItems = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            size: item.size
        }));
    
        try {
            const response = await axios.post('http://127.0.0.1:5000/order/api/order/v1', {
                user_id: userId,
                order_items: orderItems,
                shipping_address: formData.shippingAddress,
                billing_address: formData.billingAddress,
                payment_method: formData.paymentMethod
            });
    
            console.log("Order Response:", response.data);
    
            // Order successfully placed, now delete cart items
            await deleteCartItems(userId);
    
            fetchOrders();
            setCartItems([]);
            setFormData({ shippingAddress: '', billingAddress: '', paymentMethod: '' });
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error);
        }
    };
            
    // Function to delete cart items
    const deleteCartItems = async (userId) => {
        try {
            for (const item of cartItems) {
                await axios.delete(`http://127.0.0.1:5000/shoppingcard/api/shoppingCard/v1/${userId}/${item.product_id}`);
            }
            console.log("Cart items deleted successfully.");
        } catch (error) {
            console.error("Error deleting cart items:", error);
        }
    };

    useEffect(() => {
        fetchCartItems();
        fetchOrders();
    }, []);

    return (
        <div className="container mt-4 d-flex justify-content-center">
            <div className="container">
                <div className="row">
                    <div className="col-sm-8">
                        <div className=" p-5 shadow-lg" style={{ maxWidth: '600px'}}>
                            <Check_userlogin />
                            <h1 className=" text-center">Checkout</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Shipping Address</label>
                                    <textarea
                                        className="form-control"
                                        name="shippingAddress"
                                        value={formData.shippingAddress}
                                        onChange={handleInputChange}
                                        placeholder="Enter Shipping Address"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Billing Address</label>
                                    <textarea
                                        className="form-control"
                                        name="billingAddress"
                                        value={formData.billingAddress}
                                        onChange={handleInputChange}
                                        placeholder="Enter Billing Address"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Payment Method</label>
                                    <select
                                        className="form-control"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="PayPal">PayPal</option>
                                        <option value="Credit_Card">Credit_Card</option>
                                        <option value="Cash_on_Delivery">Cash_on_Delivery</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Place Order</button>
                            </form>
                            <hr />
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <h3 className="mt-5">Your Cart Items</h3>
                        {cartItems.length > 0 ? (
                            <ul className="list-group mb-3">
                                {cartItems.map((item, index) => (
                                    <li key={index} className="list-group-item">
                                        <img src={item.product_image} alt={item.product_name} style={{ width: '50px', marginRight: '10px' }} />
                                        {item.product_name} - Quantity: {item.quantity} - Price: ${item.price_at_time}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center">Your cart is empty.</p>
                        )}

                        <h2 className="mt-4 text-center">Order Tracking</h2>
                        {orderList.length > 0 ? (
                            <ul className="list-group">
                                {orderList.map((order, index) => (
                                    <li key={index} className="list-group-item">
                                        Order ID: {order.id || "N/A"} <br/>Tracking Number: {order.tracking_number || "Not Assigned Yet"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center">No orders placed yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
