import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../logo2.png'
import Header from './Header'

const Welcome: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    }
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex justify-center items-center p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">CAIXA</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">ESTADO</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">FNDE</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">SIMEC</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">FNS</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">ENTIDADE</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">PREVIDÊNCIA</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">FGTS</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">RECEITA FEDERAL</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">ADMINISTRAÇÃO</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">CONTABILIDADE</button>
                    <button className="bg-blue-700 text-white p-6 rounded hover:bg-blue-500">INDIVIDUALIZAÇÃO</button>
                </div>
            </main>         
        </div>
    );
};

export default Welcome;