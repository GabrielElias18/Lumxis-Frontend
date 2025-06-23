import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/vendedor/dashboard/Dashboard';
import Inventario from './components/vendedor/dashboard/inventario/Inventario';
import Productos from './components/vendedor/dashboard/productos/Productos';
import Balance from './components/vendedor/dashboard/balance/Balance';
import Estadisticas from './components/vendedor/dashboard/estadisticas/Estadisticas';
import Prediccion from './components/vendedor/dashboard/prediccion/Prediccion';
import Login from './components/vendedor/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/inicio/landing';
import Inicio from './components/vendedor/dashboard/inicio/Inicio';
import Registro from './components/vendedor/login/Registro';

import DashboardAdmin from './components/administrador/dashboard/DashboardAdmin';
import Usuarios from './components/administrador/dashboard/usuarios/Usuario';
import Reportes from './components/administrador/dashboard/reportes/Reportes';
import Configuracion from './components/administrador/dashboard/configuracion/Configuracion';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas para vendedores */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute rolPermitido="vendedor">
              <Dashboard />
            </ProtectedRoute>
          }
        >

          
          <Route path="inicio" element={<Inicio />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="productos" element={<Productos />} />
          <Route path="balance" element={<Balance />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="prediccion" element={<Prediccion />} />
        </Route>

        {/* Rutas protegidas para administradores */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute rolPermitido="administrador">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        >
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
