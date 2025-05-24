import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setMessage('No token found. Please log in.');
                    return;
                }
    
                const response = await axios.get('http://127.0.0.1:5000/user/api/profile/v1', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    setMessage(error.response.data.message || 'Failed to fetch profile');
                } else {
                    console.error('Error:', error.message);
                    setMessage('Network error or server is down');
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfile();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">User Profile</h2>
            {loading ? (
                <div className="alert alert-info">Fetching profile data...</div>
            ) : userData ? (
                <div className="card p-4 shadow">
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Role:</strong> {userData.role}</p>
                    <p><strong>Address:</strong> {userData.address}</p>
                </div>
            ) : (
                <div className="alert alert-warning">No profile data available.</div>
            )}
            {message && <div className="alert alert-danger mt-3">{message}</div>}
        </div>
    );
};

export default Profile;