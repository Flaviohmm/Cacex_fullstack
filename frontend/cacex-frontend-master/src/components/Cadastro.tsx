import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../index.css'
import '../App.css'
import logo from '../cacex-logo.jpeg'

const Cadastro: React.FC = () => {
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/auth/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, senha })
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert('Erro ao realizar cadastro');
        }
    };

    return (
        <div className="App">
            <div className="container-app flex flex-col md:flex-row h-screen">
                <div className="left flex-col">
                    <img src={logo} alt="CACEX Logo" className="logo md:mb-0" />
                    <Link to="/login">
                        <button className="mt shadow btn-grad focus:shadow-outline focus:outline-none text-black font-bold py-2 px-4 rounded">
                            Login
                        </button>
                    </Link>
                </div>
                <div className="right flex-1 flex items-center justify-center bg-gray-100 p-4 md:p-12">
                    <div className="login-box">
                        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input 
                                    type="text"
                                    placeholder="Usuário" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:border-blue-500" 
                                />
                            </div>
                            <div>
                                <input 
                                    type="password" 
                                    placeholder="Senha"
                                    value={senha} 
                                    onChange={(e) => setSenha(e.target.value)} 
                                    className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:border-blue-500" />
                            </div>
                            <button type="submit" className="shadow btn-grad focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full">Cadastro</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;