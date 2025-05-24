import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function User_Get() {
    const [users, setUsers] = useState([]); // Users state
    const [editUser, setEditUser] = useState(null); // User to be edited
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "",
        address: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    // 📌 Fetch Users
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/user/api/user/v1");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // 📌 Delete User
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/user/api/user/v1/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // 📌 Open Modal for Editing
    const handleEdit = (user) => {
        setEditUser(user.id);
        setFormData(user);
        document.getElementById("editModal").style.display = "block"; // Show modal
    };

    // 📌 Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 📌 Update User
    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:5000/user/api/user/v1/${editUser}`, formData);
            setUsers(users.map(user => (user.id === editUser ? { ...user, ...formData } : user)));
            closeModal();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    // 📌 Close Modal
    const closeModal = () => {
        document.getElementById("editModal").style.display = "none";
        setEditUser(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">User List</h2>
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.address}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(user)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 📌 Bootstrap Modal for Edit */}
            <div id="editModal" className="modal" style={{ display: "none" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit User</h4>
                            <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label>Username:</label>
                                <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label>Email:</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label>Role:</label>
                                <input type="text" className="form-control" name="role" value={formData.role} onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label>Address:</label>
                                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={handleUpdate}>
                                Update
                            </button>
                            <button className="btn btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
