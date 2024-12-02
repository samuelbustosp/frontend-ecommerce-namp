import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Verifica si el token está almacenado.

  if (!isAuthenticated) {
    // Redirige al login si no está autenticado.
    return <Navigate to="/login" replace />;
  }

  // Renderiza la ruta privada si está autenticado.
  return children;
};

export default PrivateRoute;
