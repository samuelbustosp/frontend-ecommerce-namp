import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
          const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                lastname,
                email,
                address,
                phone,
                username,
                password,
                role: 1
              }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            
            if (errorData.errors && Array.isArray(errorData.errors)) {
              // Para errores de validación con nuestra estructura personalizada
              const errorMessages = errorData.errors.map(err => `${err.message}`).join('\n');
              throw new Error(errorMessages);
            } else if (typeof errorData === 'string') {
              // Para el caso de "This user already exists"
              throw new Error(errorData);
            } else {
              // Para cualquier otro tipo de error
              throw new Error('Error desconocido');
            }
          }
          
          // Mostrar mensaje de éxito
          setSuccess(true);
          
          // Esperar 2 segundos antes de redirigir
          setTimeout(() => {
            navigate('/login');
          }, 1000);
          
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
    };

    const handleLoginClick = () => {
      navigate('/login');
    };
    
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-2xl">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 w-full text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="font-bold">¡Registro exitoso!</span>
                </div>
                <p>Tu cuenta ha sido creada correctamente.</p>
                <p className="mt-2">Serás redirigido a la página de inicio de sesión...</p>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleRegister} className="flex flex-col space-y-6">
                <h1 className="text-3xl poppins-bold text-center text-gray-700 mb-4">¡Regístrate!</h1>
                
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <label className="flex flex-col flex-1">
                    <span className="text-sm poppins-semibold text-gray-600">Nombre:</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <span className="text-sm poppins-semibold text-gray-600">Apellido:</span>
                    <input
                      type="text"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      required
                      className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <label className="flex flex-col flex-1">
                    <span className="text-sm poppins-semibold text-gray-600">Dirección:</span>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <span className="text-sm poppins-semibold text-gray-600">Teléfono:</span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <label className="flex flex-col">
                  <span className="text-sm poppins-semibold text-gray-600">Email:</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </label>
                
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <label className="flex flex-col flex-1">
                    <span className="text-sm poppins-semibold text-gray-600">Usuario:</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex flex-col flex-1">
                    <span className="text-sm poppins-semibold text-gray-600">Contraseña:</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center py-3 poppins rounded transition ${
                    loading 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    'Registrarse'
                  )}
                </button>
              </form>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}

              <div className="text-center poppins mt-6">
                <p className="text-gray-600">
                  ¿Ya tenés una cuenta? <span 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                    onClick={handleLoginClick}
                  >
                    Inicia sesión acá
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
};  

export default Register;
