import { useState, useEffect } from 'react';

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('token',token)

      if (!token) {
        console.error("No token found");
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
        console.log("Decoded token:", decodedToken);
        const username = decodedToken.sub;

        const response = await fetch(`http://localhost:8080/api-namp/admin/user/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el rol del usuario');
        }

        const data = await response.json();
        console.log("User role data:", data);
        setRole(data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { role, loading, error };
};

export default useUserRole;
