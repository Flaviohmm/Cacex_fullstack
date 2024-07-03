import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    }
    return (
        <div>
            <h1>Bem-vindo à página principal!</h1>
            <button onClick={handleLogout} className="shadow btn-grad focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
                Sair
            </button>
        </div>
    );
};

export default Welcome;