import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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

  const goToAdicionarDados = () => {
    navigate('/adicionar_dados');
  }

  const goToHistorico = () => {
    navigate('/historico')
  }

  const goToAnexar = () => {
    navigate('/mostrar_registros_anexados')
  }

  const goToDashboard = () => {
    navigate('/dashboard_data')
  }

  const goToAssociarUsuarioSetor = () => {
    navigate('/associar_usuario_setor')
  }

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value;
    if (path) {
      navigate(path);
    }
  }

  return (
    <header className="bg-blue-700 text-white flex flex-col md:flex-row items-center justify-between p-8 shadow-md">
        <div className="flex items-center mb-4 md:mb-0">
            <img src={Logo} alt="Logo" className="h-14 mr-2" />
        </div>
        <nav className="flex flex-wrap justify-center space-x-0 space-y-2 md:space-x-4 md:space-y-0">
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToInicio}>Início</button>
            
            {/* Dropdown para Listar Tabelas */}
            <div className="relative inline-block">
              <select 
                onChange={handleDropdownChange}
                className="hover:bg-blue-500 p-2 rounded font-bold bg-blue-700 text-white cursor-pointer w-36"
                defaultValue={""}
              >
                <option value="" disabled>Listar Tabelas</option>
                <option value="/listar_registros">Tabela Geral</option>
                <option value="/listar_tabela_administrativa">Tabela Administrativa</option>
                <option value="/listar_previdencia">Tabela Previdencia</option>
                <option value="/listar_processos">Tabela Jurídico</option>
                <option value="/listar_individualizacao_fgts">Tabela Individualização</option>
                <option value="/listar_receita_federal">Tabela Receita Federal</option>
                <option value="/listar_balanco">Tabela Contabilidade</option>
              </select>
            </div>

            {/* Dropdown para Adicionar Registros */}
            <div className="relative inline-block">
              <select 
                onChange={handleDropdownChange}
                className="hover:bg-blue-500 p-2 rounded font-bold bg-blue-700 text-white cursor-pointer w-28"
                defaultValue={""}
              >
                <option value="" disabled>Adicionar</option>
                <option value="/adicionar_registro">Adicionar Registro Geral</option>
                <option value="/adicionar_registro_administrativo">Adicionar Registro Administrativo</option>
                <option value="/adicionar_previdencia">
                  Adicionar Previdência
                </option>
                <option value="/adicionar_fgts">
                  Adicionar FGTS
                </option>
                <option value="/adicionar_empregado">
                  Adicionar Empregado
                </option>
                <option value="/registrar_individualizacao_fgts">
                  Adicionar Individualização de FGTS
                </option>
                <option value="/add_receita_federal">
                  Adicionar Receita Federal
                </option>
                <option value="/adicionar_ativo">
                  Adicionar Ativo
                </option>
                <option value="/adicionar_passivo">
                  Adicionar Passivo
                </option>
                <option value="/adicionar_processo">
                  Adicionar Processo
                </option>
              </select>
            </div>

            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToAdicionarDados}>Adicionar Dados</button> 

            {/* Dropdown para Lista de Dados*/ }
            <div className="relative inline-block">
              <select 
                onChange={handleDropdownChange}
                className="hover:bg-blue-500 p-2 rounded font-bold bg-blue-700 text-white cursor-pointer w-[162px]"
                defaultValue={""}
              >
                <option value="" disabled>Listas Primárias</option>
                <option value="/listar_dados">Lista de Dados</option>
                <option value="/listar_empregados">Lista de Empregados</option>
                <option value="/listar_associacao_usuario">Lista de Associações</option>
              </select>
            </div>         
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToHistorico}>Histórico Geral</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToAnexar}>Arquivado</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToDashboard}>Painel</button>
            <button className="hover:bg-blue-500 p-2 rounded font-bold" onClick={goToAssociarUsuarioSetor}>Associação</button>
        </nav>
        <button onClick={handleLogout} className="bg-white text-blue-700 font-bold hover:bg-gray-200 p-2 rounded mt-4 md:mt-0">
            Sair
        </button>
    </header>
  );
};

export default Header;