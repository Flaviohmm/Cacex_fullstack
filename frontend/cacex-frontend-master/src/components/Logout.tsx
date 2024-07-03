import React from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const response = await fetch('hhtp://localhost:8000/auth/sair', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert('Erro ao realizar logout');
        }
    };

    return <button onClick={handleLogout}>Logout</button>
}

export default Logout;