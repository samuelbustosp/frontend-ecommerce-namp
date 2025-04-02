import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import useFetchUserById from '../../../hooks/user/useFetchUserById';

const PrivateRoute = ({ children }) => {
  const {user,token} = useUser();
  const {role} = useFetchUserById(user?.username, token);
  const isAuthenticated = localStorage.getItem('token'); // Verifica si el token está almacenado.

  if (!isAuthenticated) {
    // Redirige al login si no está autenticado.
    return <Navigate to="/login" replace />;
  }

  if (role !=='ADMIN'){
    // Redirige al home si no tiene rol de ADMIN.
    return <Navigate to="/home" replace />;
  }
  
  // Renderiza la ruta privada si está autenticado.
  return children;
};

export default PrivateRoute;
