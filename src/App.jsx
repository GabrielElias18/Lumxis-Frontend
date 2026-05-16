import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/vendedor/dashboard/Dashboard';
import Inventario from './components/vendedor/dashboard/inventario/Inventario';
import Productos from './components/vendedor/dashboard/productos/Productos';
import Balance from './components/vendedor/dashboard/balance/Balance';
import Estadisticas from './components/vendedor/dashboard/estadisticas/Estadisticas';
import Clientes from './components/vendedor/dashboard/clientes/Clientes';
import Proveedores from './components/vendedor/dashboard/proveedores/Proveedores';
import Login from './components/vendedor/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/inicio/landing';
import Inicio from './components/vendedor/dashboard/inicio/Inicio';
import Registro from './components/vendedor/login/Registro';
import RegistrarIngresoForm from './components/vendedor/dashboard/balance/vistas/RegistrarIngresoForm';
import RegistrarEgresoForm from './components/vendedor/dashboard/balance/vistas/RegistrarEgresoForm';
import DetalleVenta from './components/vendedor/dashboard/balance/vistas/DetalleVenta';
import DetalleEgreso from './components/vendedor/dashboard/balance/vistas/DetalleEgreso';
import DetalleProducto from './components/vendedor/dashboard/inventario/vistas/DetalleProducto';
import NuevoProducto from './components/vendedor/dashboard/inventario/vistas/NuevoProducto';
import Categorias from './components/vendedor/dashboard/categorias/Categorias';

import Usuarios from './components/vendedor/dashboard/usuarios/Usuario';
import Configuracion from './components/vendedor/dashboard/configuracion/Configuracion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Interfaz Única (Dashboard) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Inicio por defecto */}
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<Inicio />} />
          
          {/* Gestión de Inventario */}
          <Route path="inventario" element={<Inventario />} />
          <Route path="productos" element={<Productos />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="producto/:id" element={<DetalleProducto />} />
          <Route path="nuevo-producto" element={<NuevoProducto />} />

          {/* Gestión de Finanzas */}
          <Route path="balance" element={<Balance />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="nueva-venta" element={<RegistrarIngresoForm />} />
          <Route path="nuevo-egreso" element={<RegistrarEgresoForm />} />
          <Route path="venta/:id" element={<DetalleVenta />} />
          <Route path="egreso/:id" element={<DetalleEgreso />} />

          {/* Gestión de Contactos */}
          <Route path="clientes" element={<Clientes />} />
          <Route path="proveedores" element={<Proveedores />} />

          {/* Gestión de Empresa (Antes Admin) */}
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

        {/* Redirección para rutas no encontradas o antiguas */}
        <Route path="/admin/*" element={<Navigate to="/dashboard/inicio" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
