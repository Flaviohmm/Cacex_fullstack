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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
