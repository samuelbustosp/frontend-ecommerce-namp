import { useState, useEffect } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const useFetchUserById = (username, token) => {
  const [idUser, setIdUser] = useState(null);
  const [role, setRole] = useState(null)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!username || !token) return;
      try {
        const response = await fetch(`${backendUrl}/api-namp/admin/users`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("No se pudieron obtener los usuarios");
        }

        const users = await response.json();
        const foundUser = users.find((u) => u.username === username);

        if (!foundUser) {
          throw new Error("Usuario no encontrado");
        }

        setRole(foundUser.role)
        setIdUser(foundUser.idUser);
      } catch (err) {
        console.error("Error al obtener el id del usuario:", err);
        setError(err.message);
      }
    };

    fetchUser();
  }, [username, token]);

  return { idUser, role, error };
};

export default useFetchUserById;
