import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({})=> {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
    
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
                role:1
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
    
          navigate('/login');
        } catch (err) {
          setError(err.message);
        }
    };

    const handleLoginClick = () => {
      navigate('/login');
    };
    
    return (
      <div className="flex items-center justify-center w-full h-screen">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-2xl">
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
            className="bg-blue-600 text-white py-3 poppins rounded hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}

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
      </div>
    </div>
    );
};  

export default Register;