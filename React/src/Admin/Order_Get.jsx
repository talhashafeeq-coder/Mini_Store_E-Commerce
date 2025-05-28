import React, { useEffect, useState } from 'react';
import axios from "axios";
import '../Style/Admin_Order_Get.css';

export default function Order_Get() {
    const [orderList, setOrderList] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 20;
 
    // ✅ Export to CSV
const exportToCSV = () => {
    const headers = [
        "Order ID", "User ID", "Order Date", "Total", "Items", "Status", "Payment", "Address"
    ];

    const rows = currentOrders.map(order => ([
        order.id,
        order.user_id,
        order.order_date,
        order.total_amount,
        order.order_items.map(item => item.product_id).join(", "),
        order.status,
        order.payment_method,
        order.shipping_address
    ]));

    const csvContent = [
        headers.join(","),      // Add header row
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


    // ✅ Fetch Orders
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/order/api/order/v1");
                setOrderList(response.data);
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

    // ✅ Dropdown Change Handler
    const handleDropdownChange = (orderId, newStatus) => {
        setSelectedStatuses((prev) => ({
            ...prev,
            [orderId]: newStatus
        }));
    };

    // ✅ Status Update Submit
    const handleStatusUpdate = async (orderId) => {
        try {
            const newStatus = selectedStatuses[orderId];
            const response = await axios.put(
                `http://127.0.0.1:5000/order/api/order/v1/${orderId}/status`,
                { status: newStatus }
            );
            if (response.status === 200) {
                setOrderList((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // ✅ Filtered + Searched Orders
    const filteredOrders = orderList.filter(order => {
        const matchSearch = order.id.toString().includes(searchTerm) || 
                            order.user_id.toString().includes(searchTerm);
        const matchStatus = statusFilter ? order.status === statusFilter : true;
        return matchSearch && matchStatus;
    });

    // ✅ Pagination Logic
    const indexOfLast = currentPage * ordersPerPage;
    const indexOfFirst = indexOfLast - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='container my-4'>
           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <h2 className="order-heading fancy-heading m-0">Order Management</h2>
            <button className="btn btn-success btn-sm export-btn">
                📥 Export CSV
            </button>
        </div>
            {/* ✅ Filters */}
            <div className="filters mb-4 d-flex flex-wrap gap-3 justify-content-between align-items-center">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search by Order ID or User ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="form-select w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* ✅ Table */}
            <div className="table-container">
                <table className="table order-table table-responsive table-bordered">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Order Date</th>
                            <th>Total</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Payment</th>
                            <th>Address</th>
                            <th>Now Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map(order => (
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
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleStatusUpdate(order.id)}
                                        disabled={selectedStatuses[order.id] === order.status}
                                    >
                                        Change
                                    </button>
                                </td>
                                <td>{order.payment_method}</td>
                                <td>{order.shipping_address}</td>
                                <td>
                                    <span className={`status-badge status-${order.status}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Pagination */}
            <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={`btn btn-sm mx-1 ${page === currentPage ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => paginate(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}
