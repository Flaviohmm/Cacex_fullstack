import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cadastro from './components/Cadastro';
import Login from './components/Login';
import Logout from './components/Logout';
import Welcome from './components/Welcome';
import AdicionarDados from './components/AdicionarDados';
import AdicionarRegistro from './components/AdicionarRegistro';
import ListarDados from './components/ListarDados';
import ListarRegistros from './components/ListarRegistros';
import EditRegistro from './components/EditRegistro';
import HistoricoRegistro from './components/HistoricoRegistro';
import HistoricoRegistroID from './components/HistoricoRegistroID';
import Anexados from './components/Anexados';
import TabelaCaixa from './components/TabelaCaixa';
import ListarTabelaCaixa from './components/ListarTabelaCaixa';
import ListarTabelaEstado from './components/ListarTabelaEstado';
import ListarTabelaFnde from './components/ListarTabelaFnde';
import ListarTabelaSimec from './components/ListarTabelaSimec';
import ListarTabelaFns from './components/ListarTabelaFns';
import ListarTabelaEntidade from './components/ListarTabelaEntidade';
import Dashboard from './components/Dashboard';
import AdicionarRegistroAdministrativo from './components/AdicionarRegistroAdministrativo';
import ListarTabelaAdministrativa from './components/ListarTabelaAdministrativa';
import EditRegistroAdministrativo from './components/EditRegistroAdministrativo';
import AdicionarFuncionarioPrevidencia from './components/AdicionarFuncionarioPrevidencia';
import ListarFuncionarioPrevidencia from './components/ListarFuncionarioPrevidencia';
import EditarFuncionarioPrevidencia from './components/EditarFuncionarioPrevidencia';
import FGTSForm from './components/FGTSForm';
import ListFGTS from './components/ListFGTS';
import PrivateRoute from './PrivateRoute';


const App: React.FC = () => {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/cadastro' element={<Cadastro />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/' element={<PrivateRoute element={<Welcome />} />} />
          <Route path="/adicionar_registro" element={<AdicionarRegistro />} />
          <Route path="/adicionar_dados" element={<AdicionarDados />} />
          <Route path='/listar_registros' element={<ListarRegistros />} />
          <Route path="/listar_dados" element={<ListarDados />} />
          <Route path='/editar/:id' element={<EditRegistro />} />
          <Route path='/historico' element={<HistoricoRegistro />} />
          <Route path='/historico/:id' Component={HistoricoRegistroID} />
          <Route path='/mostrar_registros_anexados' element={<Anexados />} />
          <Route path='/tabela_caixa' Component={TabelaCaixa} />
          <Route path='/listar_tabela_caixa/:municipioId' Component={ListarTabelaCaixa} />
          <Route path='/tabela_estado' Component={ListarTabelaEstado} />
          <Route path='/tabela_fnde' Component={ListarTabelaFnde} />
          <Route path='/tabela_simec' Component={ListarTabelaSimec} />
          <Route path='/tabela_fns' Component={ListarTabelaFns} />
          <Route path='/tabela_entidade' Component={ListarTabelaEntidade} />
          <Route path='/dashboard_data' Component={Dashboard} />
          <Route path='/adicionar_registro_administrativo' Component={AdicionarRegistroAdministrativo} />
          <Route path='/listar_tabela_administrativa' Component={ListarTabelaAdministrativa} />
          <Route path='/editar_registro_administrativo/:id' Component={EditRegistroAdministrativo} />
          <Route path='/adicionar_previdencia' Component={AdicionarFuncionarioPrevidencia} />
          <Route path='/listar_previdencia' Component={ListarFuncionarioPrevidencia} />
          <Route path='/editar_previdencia/:pk' Component={EditarFuncionarioPrevidencia} />
          <Route path='/adicionar_fgts' Component={FGTSForm} />
          <Route path='/listar_fgts' Component={ListFGTS} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
