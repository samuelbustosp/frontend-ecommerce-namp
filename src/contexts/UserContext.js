import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUserFromToken = () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split(".")[1]));
          const now = Math.floor(Date.now() / 1000); // Obtener la hora actual en segundos

          if (payload.exp > now) {
            setUser({ username: payload.sub });
            setToken(storedToken);
          } else {
            console.log("Token expirado");
            setUser(null);
            setToken(null);
            localStorage.removeItem("token"); // Limpiar el token expirado
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          setUser(null);
          setToken(null);
          localStorage.removeItem("token"); // Limpiar el token si hay un error
        }
      } else {
        setUser(null);
        setToken(null);
      }
    };

    loadUserFromToken();
  }, []);

  const login = (newToken) => {
    try {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      const payload = JSON.parse(atob(newToken.split(".")[1]));
      setUser({ username: payload.sub });
    } catch (error) {
      console.error("Error al procesar el token:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};