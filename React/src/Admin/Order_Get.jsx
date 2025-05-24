import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function Order_Get() {
    const [orderList, setOrderList] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState({});

    // ✅ Fetch Orders from Backend
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/order/api/order/v1");
                console.log("order DATA", response.data);
                setOrderList(response.data);
                // ✅ Initialize selectedStatuses with current order statuses
                const initialStatuses = {};
                response.data.forEach(order => {
                    initialStatuses[order.id] = order.status;
                });
                setSelectedStatuses(initialStatuses);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };
        fetchOrderData();
    }, []);

    // ✅ Handle Dropdown Change (But Don't Update API Yet)
    const handleDropdownChange = (orderId, newStatus) => {
        setSelectedStatuses((prev) => ({
            ...prev,
            [orderId]: newStatus
        }));
    };

    // ✅ Submit Button Click: Send Updated Status to Backend
    const handleStatusUpdate = async (orderId) => {
        try {
            const newStatus = selectedStatuses[orderId];
            const response = await axios.put(
                `http://127.0.0.1:5000/order/api/order/v1/${orderId}/status`,
                { status: newStatus }
            );
            if (response.status === 200) {
                // ✅ Update UI after successful update
                setOrderList((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                console.log("Order status updated successfully");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className='container'>
            <h1>Order Management</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>Payment Method</th>
                        <th>Shipping Address</th>
                        <th>Now Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orderList.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_id}</td>
                            <td>{order.order_date}</td>
                            <td>{order.total_amount}</td>
                            <td>
                                {order.order_items.map((item, index) => (
                                    <span key={index}>{item.product_id} </span>
                                ))}
                            </td>
    
                            {/* ✅ Dropdown to Change Order Status */}
                            <td>
                                <select
                                    value={selectedStatuses[order.id]}
                                    onChange={(e) => handleDropdownChange(order.id, e.target.value)}
                                >
                                    <option value="pending">pending</option>
                                    <option value="shipped">shipped</option>
                                    <option value="delivered">delivered</option>
                                    <option value="cancelled">cancelled</option>
                                </select>
                            </td>
    
                            {/* ✅ Submit Button for Each Order */}
                            <td>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleStatusUpdate(order.id)}
                                    disabled={selectedStatuses[order.id] === order.status}  // ✅ Disable if status is unchanged
                                >
                                    Change Status
                                </button>
                            </td>
    
                            <td>{order.payment_method}</td>
                            <td>{order.shipping_address}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
    
