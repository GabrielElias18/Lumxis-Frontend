import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, rolPermitido }) => {
  // Obtener el token y el rol desde localStorage
  const isAuthenticated = localStorage.getItem('token');
  const userRol = localStorage.getItem('rol'); // Guardaste el rol en el login

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si el rol del usuario no coincide con el rol permitido, redirigir al dashboard correspondiente
  if (rolPermitido && userRol !== rolPermitido) {
    return userRol === "administrador" ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }

  // Si está autenticado y tiene el rol correcto, renderizar los componentes hijos
  return children;
};

export default ProtectedRoute;
