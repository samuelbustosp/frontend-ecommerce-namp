import { useState, useEffect } from "react";

const useFetchUserById = (username, token) => {
  const [idUser, setIdUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!username || !token) return;

      try {
        const response = await fetch("http://localhost:8080/api-namp/admin/users", {
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

        setIdUser(foundUser.idUser);
      } catch (err) {
        console.error("Error al obtener el id del usuario:", err);
        setError(err.message);
      }
    };

    fetchUser();
  }, [username, token]);

  return { idUser, error };
};

export default useFetchUserById;
