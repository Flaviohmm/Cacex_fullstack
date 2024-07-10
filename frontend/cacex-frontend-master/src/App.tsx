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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
