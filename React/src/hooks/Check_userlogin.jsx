import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Check_userlogin() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login'); // Redirect to login page
        }
    }, [navigate]); // Dependency array ensures effect runs only on mount

    return null; // No need to return any UI
}
