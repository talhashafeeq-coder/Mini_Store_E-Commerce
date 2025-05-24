import React from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct named import for the decode function

function JwttokenGet() {
    const token = localStorage.getItem("token");  // Check if token is under this key
    if (!token) {
        // console.log("No token found");
        return null; // Return null if token is not found
    }

    try {
        const decoded = jwtDecode(token); // Decode the JWT token
        // console.log("Decoded Token:", decoded);  // Log the decoded token to inspect the structure
        return decoded.id || decoded.sub || decoded.user_id; // Make sure to check for user ID under different keys
    } catch (error) {
        console.error("JWT Decode Error:", error);
        return null;
    }
}

export default function App() {
    const userID = JwttokenGet();
    // console.log("User ID:", userID);
    return userID;

    return (
        <div>
        </div>
    );
}