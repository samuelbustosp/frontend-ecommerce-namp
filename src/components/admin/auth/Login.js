import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();
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
      login(token);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center w-full h-screen px-4">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-md mx-auto">
        <form onSubmit={handleLogin} className="flex flex-col space-y-6">
          <h1 className="text-2xl sm:text-3xl poppins-bold text-center text-gray-700">Iniciar sesión</h1>
          <label className="flex flex-col">
            <span className="text-sm poppins-semibold text-gray-600">Usuario:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 sm:p-3 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm poppins-semibold text-gray-600">Contraseña:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 sm:p-3 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 sm:py-3 poppins rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </form>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        <div className="text-center poppins mt-4 sm:mt-6">
          <p className="text-gray-600 text-sm sm:text-base">
            ¿Todavía no tenés cuenta? <span
              className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
              onClick={handleRegisterClick}
            >
              Registrate acá
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;