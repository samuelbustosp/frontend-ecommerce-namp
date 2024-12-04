import { useState, useEffect } from 'react';

const useFetchUser = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el token
      const username = decodedToken.sub;

      try {
        const response = await fetch(`http://localhost:8080/api-namp/admin/user?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Corregir espacio después de "Bearer"
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el rol del usuario');
        }

        const data = await response.json();
        console.log('userdata', data);
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Nueva función para limpiar los datos del usuario
  const clearUserData = () => {
    setUserData(null); // Limpia los datos del usuario
    setError(null); // Limpia errores
    setLoading(false); // Detiene cualquier estado de carga
  };

  return { userData, loading, error, clearUserData }; // Devolver clearUserData
};

export default useFetchUser;
