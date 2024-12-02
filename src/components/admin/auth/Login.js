import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

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
      // Ejemplo: history.push('/dashboard');
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-1/4 max-w-2xl">
        <form onSubmit={handleLogin} className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-700">Iniciar sesión</h1>
          <label className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600">Usuario:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600">Contraseña:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </form>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
