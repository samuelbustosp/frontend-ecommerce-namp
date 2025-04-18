import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import useFetchUserById from '../../../hooks/user/useFetchUserById';

const PrivateRoute = ({ children }) => {
  const { user, token, checkTokenValidity } = useUser();
  const { role } = useFetchUserById(user?.username, token);

  // Verificar la validez del token cada vez que se renderiza la ruta privada
  const isAuthenticated = checkTokenValidity();

  if (!isAuthenticated) {
    // Redirige al login si no está autenticado o el token expiró
    return <Navigate to="/login" replace />;
  }

  if (role === 'USER') {
    // Redirige al home si no tiene rol de ADMIN
    return <Navigate to="/home" replace />;
  }

  // Renderiza la ruta privada si está autenticado
  return children;
};

export default PrivateRoute;