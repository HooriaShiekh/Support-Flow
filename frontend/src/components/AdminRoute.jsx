import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    // Check karein ke user logged in hai aur uska role admin hai
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Jab login ho, tab role localStorage mein save hona chahiye

    if (!token || role !== 'admin') {
        // Agar admin nahi hai, toh seedha login ya home page par bhej dein
        alert("Access Denied! Admins only.");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminRoute;