import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../logo2.png';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const goToInicio = () => {
    navigate('/')
  }

  const goToAdicionarRegistro = () => {
    navigate('/adicionar_registro')
  }

  const goToAdicionarDados = () => {
    navigate('/adicionar_dados');
  }

  const goToListarRegistros = () => {
    navigate('/listar_registros')
  }

  const goToListarDados = () => {
    navigate('/listar_dados')
  }

  const goToHistorico = () => {
    navigate('/historico')
  }

  const goToAnexar = () => {
    navigate('/mostrar_registros_anexados')
  }

  return (
    <header className="bg-blue-700 text-white flex flex-col md:flex-row items-center justify-between p-8">
        <div className="flex items-center mb-4 md:mb-0">
            <img src={Logo} alt="Logo" className="h-14 mr-2" />
        </div>
        <nav className="flex flex-wrap justify-center space-x-0 space-y-2 md:space-x-4 md:space-y-0">
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToInicio}>Início</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToListarRegistros}>Tabelas</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToAdicionarRegistro}>Adicionar Registros</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToAdicionarDados}>Adicionar Dados</button>           
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToListarDados}>Listar Dados</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToHistorico}>Histórico Geral</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToAnexar}>Arquivado</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold">Painel</button>
        </nav>
        <button onClick={handleLogout} className="bg-white text-blue-700 font-bold hover:bg-gray-200 p-2 rounded mt-4 md:mt-0">
            Sair
        </button>
    </header>
  );
};

export default Header;