import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../logo2.png';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <header className="bg-blue-700 text-white flex flex-col md:flex-row items-center justify-between p-4">
        <div className="flex items-center mb-4 md:mb-0">
            <img src={Logo} alt="Logo" className="h-10 mr-2" />
        </div>
        <nav className="flex flex-wrap justify-center space-x-0 space-y-2 md:space-x-4 md:space-y-0">
            <button className="hover:bg-blue-500 p-2 rounded">Início</button>
            <button className="hover:bg-blue-500 p-2 rounded">Tabelas</button>
            <button className="hover:bg-blue-500 p-2 rounded">Adicionar Registros</button>
            <button className="hover:bg-blue-500 p-2 rounded">Adicionar Dados</button>
            <button className="hover:bg-blue-500 p-2 rounded">Listar Dados</button>
            <button className="hover:bg-blue-500 p-2 rounded">Histórico Geral</button>
            <button className="hover:bg-blue-500 p-2 rounded">Arquivado</button>
            <button className="hover:bg-blue-500 p-2 rounded">Painel</button>
        </nav>
        <button onClick={handleLogout} className="bg-white text-blue-700 hover:bg-gray-200 p-2 rounded mt-4 md:mt-0">
            Sair
        </button>
    </header>
  );
};

export default Header;