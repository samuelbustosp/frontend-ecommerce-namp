import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const checkTokenValidity = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        const now = Math.floor(Date.now() / 1000); // Obtener la hora actual en segundos
        if (payload.exp > now) {
          return true;
        } else {
          console.log("Token expirado");
          handleLogout();
          return false;
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        handleLogout();
        return false;
      }
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  // Configurar wrapper para fetch que verifica errores de autenticación
  const fetchWithAuth = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      
      // Si hay error de autenticación, cerrar sesión
      if (response.status === 401 || response.status === 403) {
        console.log("Error de autenticación detectado en respuesta HTTP");
        handleLogout();
      }
      
      return response;
    } catch (error) {
      console.error("Error en petición fetch:", error);
      throw error;
    }
  };

  // Verificar periódicamente si el token sigue siendo válido
  useEffect(() => {
    const loadUserFromToken = () => {
      if (checkTokenValidity()) {
        const storedToken = localStorage.getItem("token");
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUser({ username: payload.sub });
        setToken(storedToken);
      }
    };

    loadUserFromToken();

    // Verificar el token cada minuto
    const tokenCheckInterval = setInterval(() => {
      checkTokenValidity();
    }, 60000); // 60000 ms = 1 minuto

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [navigate]);

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
    handleLogout();
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      checkTokenValidity,
      fetchWithAuth // Exponemos la función fetch personalizada
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};