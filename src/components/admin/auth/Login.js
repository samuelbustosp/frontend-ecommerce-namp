import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from "flowbite-react"; // Importamos el spinner de Flowbite

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar el spinner
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Iniciar el spinner

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      const token = data.token;

      // Guardar el token en localStorage
      localStorage.setItem('token', token);

      // Pasar el token al componente padre (si lo necesitas)
      setToken(token);

      // Redirigir al usuario o cambiar el estado de la aplicación
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Detener el spinner
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen shadow-xl">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-1/4 max-w-2xl">
        <form onSubmit={handleLogin} className="flex flex-col space-y-6">
          <h1 className="text-3xl poppins-bold text-center text-gray-700">Iniciar sesión</h1>
          <label className="flex flex-col">
            <span className="text-sm poppins-semibold text-gray-600">Usuario:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm poppins-semibold text-gray-600">Contraseña:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 poppins-regular text-white py-3 px-2 rounded-full w-1/2 ml-auto mr-auto hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading} // Deshabilitar el botón mientras cargando
          >
            {loading ? (
              <Spinner size="sm" color="light" />
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
