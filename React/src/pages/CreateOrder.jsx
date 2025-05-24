import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [show, setShow] = useState(false);
    const [orderData, setOrderData] = useState({ user_id: '', order_date: '', total_amount: '', items: [] });
    const [editingOrder, setEditingOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);
    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/order/api/orders/v1');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        setEditingOrder(null);
        setOrderData({ user_id: '', order_date: '', total_amount: '', items: [] });
    };
    const handleShow = (order = null) => {
        setShow(true);
        if (order) {
            setEditingOrder(order.id);
            setOrderData(order);
        }
    };
    const handleChange = (e) => {
        setOrderData({ ...orderData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOrder) {
                await axios.put(`http://localhost:5000/order/api/orders/v1/${editingOrder}`, orderData);
            } else {
                await axios.post('http://localhost:5000/order/api/orders/v1', orderData);
            }
            fetchOrders();
            handleClose();
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/order/api/orders/v1/${id}`);
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };
    return (
        <div className='container mt-4'>
            <h2>Orders</h2>
            <Button variant='primary' onClick={() => handleShow()}>Add Order</Button>
            <Table striped bordered hover className='mt-3'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_id}</td>
                            <td>{order.order_date}</td>
                            <td>{order.total_amount}</td>
                            <td>
                                <Button variant='warning' onClick={() => handleShow(order)}>Edit</Button>{' '}
                                <Button variant='danger' onClick={() => handleDelete(order.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingOrder ? 'Edit Order' : 'Add Order'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>User ID</Form.Label>
                            <Form.Control type='text' name='user_id' value={orderData.user_id} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Order Date</Form.Label>
                            <Form.Control type='text' name='order_date' value={orderData.order_date} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Total Amount</Form.Label>
                            <Form.Control type='text' name='total_amount' value={orderData.total_amount} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant='primary' type='submit' className='mt-3'>Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Orders;
