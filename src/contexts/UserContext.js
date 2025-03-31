import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext();

// Crear un proveedor para el contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Guardar el token en el estado

  useEffect(() => {
    const loadUserFromToken = () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split(".")[1])); // Decodificar el JWT
          setUser({ username: payload.sub }); // Asignar el username correctamente
          setToken(storedToken); // Guardar el token en el estado
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          setUser(null);
          setToken(null); // Limpiar el token si hay un error
        }
      } else {
        setUser(null);
        setToken(null); // Limpiar el token si no se encuentra
      }
    };

    loadUserFromToken();
  }, []);

  const login = (newToken) => {
    try {
      localStorage.setItem("token", newToken);
      setToken(newToken); // Guardar el nuevo token en el estado
      const payload = JSON.parse(atob(newToken.split(".")[1])); // Decodificar el JWT
      setUser({ username: payload.sub }); // Guardar el username
    } catch (error) {
      console.error("Error al procesar el token:", error);
      setUser(null);
      setToken(null); // Limpiar el token si hay un error
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null); // Limpiar el token en el estado
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => {
  return useContext(UserContext);
};
