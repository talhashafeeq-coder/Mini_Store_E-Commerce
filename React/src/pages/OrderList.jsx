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
        <div className="container mt-5">
  <div className="row justify-content-center">

    {/* Checkout Form Section */}
    <div className="col-md-7 mb-4">
      <div className="p-4 shadow rounded bg-white">
        <Check_userlogin />
        <h2 className="text-center mb-4 text-primary fw-bold">Checkout</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Shipping Address</label>
            <textarea
              className="form-control"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Enter shipping address"
              rows="2"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Billing Address</label>
            <textarea
              className="form-control"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="Enter billing address"
              rows="2"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Payment Method</label>
            <select
              className="form-select"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="">Select Payment Method</option>
              <option value="PayPal">PayPal</option>
              <option value="Credit_Card">Credit Card</option>
              <option value="Cash_on_Delivery">Cash on Delivery</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100 py-2 fw-bold">
            Place Order
          </button>
        </form>
      </div>
    </div>

    {/* Cart + Order Section */}
    <div className="col-md-5">
      <div className="bg-light p-3 shadow-sm rounded mb-4">
        <h4 className="text-center text-dark">Your Cart Items</h4>
        {cartItems.length > 0 ? (
          <ul className="list-group">
            {cartItems.map((item, index) => (
              <li key={index} className="list-group-item d-flex align-items-center">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                />
                <div>
                  <strong>{item.product_name}</strong><br />
                  Quantity: {item.quantity} | Price: ${item.price_at_time}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">Your cart is empty.</p>
        )}
      </div>

      <div className="bg-white p-3 shadow-sm rounded">
        <h4 className="text-center text-dark">Order Tracking</h4>
        {orderList.length > 0 ? (
          <ul className="list-group">
            {orderList.map((order, index) => (
              <li key={index} className="list-group-item">
                <strong>Order ID:</strong> {order.id || "N/A"}<br />
                <strong>Tracking #:</strong> {order.tracking_number || "Not Assigned Yet"}
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
