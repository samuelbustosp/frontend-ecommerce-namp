import { useState, useEffect } from 'react';

const useUserRole = () => {
  const [role, setRole] = useState(null); // Estado para almacenar el rol del usuario
  const [loading, setLoading] = useState(true); // Estado para saber si está cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true); // Establecer estado de carga a true mientras se realiza la solicitud
      const token = localStorage.getItem('token'); // Obtener el token desde el localStorage

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
      const username = decodedToken.sub; // Usualmente el ID del usuario está en el "sub" (subject)

      try {
        // Hacer una solicitud al backend usando el nombre de usuario (o ID) para obtener los datos del usuario
        const response = await fetch(`http://localhost:8080/api-namp/admin/user/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer${token}`, // Incluir el token en el header
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el rol del usuario');
        }

        const data = await response.json();
        setRole(data.role); // Almacenar el rol del usuario en el estado
      } catch (error) {
        setError(error.message); // Manejar errores
      } finally {
        setLoading(false); // Cambiar el estado de carga
      }
    };

    fetchUserRole();
  }, []); // Solo se ejecuta una vez al montar el componente

  return { role, loading, error }; // Devuelve el rol, estado de carga y errores
};

export default useUserRole;
