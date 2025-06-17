import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useUser();

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      console.log('token',token)

      if (!token) {
        console.error("No token found");
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api-namp/admin/user/${user.username}`, {
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
