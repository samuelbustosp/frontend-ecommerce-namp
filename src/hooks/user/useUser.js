import { useState, useEffect } from "react";

const useUser = () => {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodificar el token JWT
        const username = decodedToken.sub; // Suponiendo que el "sub" es el username o ID

        const response = await fetch(`http://localhost:8080/api-namp/admin/user/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Aquí faltaba un espacio
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener los datos del usuario");
        }

        const userData = await response.json();
        setUser(userData); // Guardamos todo el usuario en el estado
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Se ejecuta una vez al montar el componente

  return { user, loading, error };
};

export default useUser;
