import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/Order.css'; // Include custom styles for shadows, transitions

export default function OrderGet() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, setReason] = useState('');
  const [returnMessage, setReturnMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  const userId = decoded.id || decoded.sub || decoded.user_id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://127.0.0.1:5000/order/api/order/v1");
        setOrders(res.data || []);
        console.log(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order data");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openModal = (orderId) => {
    setSelectedOrder(orderId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setReason('');
  };

  const handleReturn = async () => {
    if (!reason) return alert("Please enter a return reason.");
    try {
      const response = await axios.post("http://127.0.0.1:5000/return/api/createReturn/v1", {
        order_id: selectedOrder,
        reason,
        user_id: userId
      });
      setReturnMessage("Return request submitted successfully.");
      closeModal();
    } catch (err) {
      console.error(err);
      setReturnMessage("Failed to submit return request.");
    }
  };

  const renderProgress = (status) => {
    const steps = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
    const current = steps.indexOf(status);
    return (
      <div className="progress-tracker">
        {steps.map((step, i) => (
          <div className={`step ${i <= current ? 'active' : ''}`} key={i}>
            <div className="circle">{i + 1}</div>
            <div className="label">{step}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary">Your Orders</h2>
      {loading && <div className="text-center"><div className="spinner-border text-primary" /></div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {returnMessage && <div className="alert alert-success text-center">{returnMessage}</div>}

      <div className="row">
        {orders.map((order) => (
          <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
            <div className="card shadow order-card">
              <div className="card-body">
                <h5 className="card-title">Name : { order.user_id}</h5>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Quantity:</strong> {order.order_items[0]?.quantity || 'N/A'}</p>
                <p><strong>Total:</strong> ${order.order_items[0]?.subtotal || 'N/A'}</p>
                <p><strong>Shipping To:</strong> {order.shipping_address}</p>
                <p><strong>Ordered On:</strong> {order.order_date}</p>
                <p><strong>Tracking No:</strong> {order.tracking_number}</p>
                <p><strong>Location :</strong> {order.shipping_address}</p>
                {/* {renderProgress(order.status)} */}
                <button className="btn btn-warning btn-sm mt-2" onClick={() => openModal(order.id)}>Return Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Return Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Return Order</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter your return reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button className="btn btn-primary" onClick={handleReturn}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
