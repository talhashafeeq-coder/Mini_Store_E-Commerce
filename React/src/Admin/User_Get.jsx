import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/UserGet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function User_Get() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "",
        address: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/user/api/user/v1");
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = users.filter((user) =>
            user.username.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value) ||
            user.role.toLowerCase().includes(value) ||
            user.address.toLowerCase().includes(value)
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/user/api/user/v1/${id}`);
            const updatedUsers = users.filter((user) => user.id !== id);
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers.filter((user) =>
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.role.toLowerCase().includes(searchTerm) ||
                user.address.toLowerCase().includes(searchTerm)
            ));
            toast.success("User deleted successfully! 👋");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user!");
        }
    };

    const handleEdit = (user) => {
        setEditUser(user.id);
        setFormData(user);
        document.getElementById("editModal").style.display = "flex";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:5000/user/api/user/v1/${editUser}`, formData);
            const updatedUsers = users.map((user) =>
                user.id === editUser ? { ...user, ...formData } : user
            );
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers.filter((user) =>
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.role.toLowerCase().includes(searchTerm) ||
                user.address.toLowerCase().includes(searchTerm)
            ));
            closeModal();
            toast.success("User updated successfully! ✏️");
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user!");
        }
    };

    const closeModal = () => {
        document.getElementById("editModal").style.display = "none";
        setEditUser(null);
    };

    return (
        <div className="user-container container mt-4">
            <h2 className="user-heading text-center mb-4">User List</h2>

            {/* 🔍 Search Input */}
            <div className="d-flex justify-content-end mb-3">
                <input
                    type="text"
                    className="form-control w-100 w-sm-50"
                    placeholder="Search by name, email, role or address..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* 📋 Table */}
            <div className="table-responsive">
                <table className="user-table table table-bordered table-striped">
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
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
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
                                <td colSpan="6" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ✏️ Edit Modal */}
            <div id="editModal" className="custom-modal">
                <div className="modal-box">
                    <h4 className="mb-3">Edit User</h4>
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
                    <div className="d-flex justify-content-end mt-3 gap-2">
                        <button className="btn btn-success" onClick={handleUpdate}>Update</button>
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* ✅ Toast Container */}
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
}
