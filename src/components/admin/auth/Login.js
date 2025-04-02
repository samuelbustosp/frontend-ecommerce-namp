import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [buttonState, setButtonState] = useState('normal'); // normal, loading, circle, success
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Cuando el estado cambia a 'circle', programamos la transición a 'success'
    if (buttonState === 'circle') {
      const timer = setTimeout(() => {
        setButtonState('success');
      }, 400);
      return () => clearTimeout(timer);
    }

    // Cuando es exitoso, redirigimos después de mostrar el check
    if (buttonState === 'success') {
      const timer = setTimeout(() => {
        navigate('/home');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [buttonState, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setButtonState('loading');

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
      
      // Iniciar la secuencia de animación
      setButtonState('circle');

    } catch (err) {
      setError(err.message);
      setButtonState('normal');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Clases dinámicas para el botón basadas en su estado
  const getButtonClasses = () => {
    const baseClasses = "relative flex items-center justify-center transition-all duration-300 text-white font-medium poppins-light";
    
    switch (buttonState) {
      case 'loading':
        return `${baseClasses} bg-blue-500 py-2 sm:py-3 rounded w-full`;
      case 'circle':
        return `${baseClasses} bg-green-500 h-12 w-12 rounded-full mx-auto`;
      case 'success':
        return `${baseClasses} bg-green-500 h-12 w-12 rounded-full mx-auto`;
      default: // normal
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 py-2 sm:py-3 rounded w-full`;
    }
  };

  // Contenido del botón basado en su estado
  const getButtonContent = () => {
    switch (buttonState) {
      case 'loading':
        return (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Iniciando sesión...
          </>
        );
      case 'circle':
        return null; // Vacío durante la transición
      case 'success':
        return (
          <svg className="w-6 h-6 text-white animate-appear" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      default: // normal
        return "Iniciar sesión";
    }
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
              disabled={buttonState !== 'normal'}
              className="border border-gray-300 rounded p-2 sm:p-3 focus:outline-none focus:ring focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </label>
          
          <label className="flex flex-col">
            <span className="text-sm poppins-semibold text-gray-600">Contraseña:</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={buttonState !== "normal"}
                className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // Ícono de ojo tachado (ocultar)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  // Ícono de ojo (mostrar)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={buttonState !== 'normal'}
              className={getButtonClasses()}
            >
              {getButtonContent()}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
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