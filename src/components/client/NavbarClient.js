import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaChevronDown, FaChevronUp } from "react-icons/fa"; 
import { MdLocalShipping } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../../components/client/assets/logo-namp-bl.png";
import { FiLogOut } from "react-icons/fi";
import { FaChartPie } from "react-icons/fa";
import useFetchUser from "../../hooks/user/useUserRole";


const NavbarClient = ({ toggleMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const { userData, loading, error, clearUserData } = useFetchUser(); // clearUserData para resetear datos
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
          const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el JWT
          setUsername(payload.sub);
      } else {
          setUsername(null);
      }
  }, []);

  const handleToggle = () => {
      setIsOpen(!isOpen);
      toggleMenu();
  };

  

  const handleRedirectToDashboard = () => {
      navigate("/dashboard");
  };

  return (
      <header className="flex flex-col">
          <div className="bg-banner-not text-white poppins-light text-center text-sm p-1">
              <p className="flex items-center justify-center cursor-default">
                  <span className="mr-1"><MdLocalShipping /></span>
                  ¡Envíos gratis en compras superiores a
                  <span className="font-semibold">&nbsp;$30,000</span>!
              </p>
          </div>
          <div className="bg-nav flex items-center justify-between gap-2 p-4">
              <Link to={'/home'} className="p-2 rounded-sm">
                  <img src={logo} alt="logo-navbar" className="h-12 rounded-2xl ml-4 -m-4" />
                  <span className="sr-only">Toggle navigation</span>
              </Link>
              <form className="relative flex items-center w-1/2">
                  <input
                      type="text"
                      placeholder="¿Qué estás buscando?"
                      className="w-full p-2 border rounded-full border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                  />
                  <button type="submit" className="absolute right-3 flex items-center justify-center h-full">
                      <FaSearch className="text-gray-500 text-lg" />
                  </button>
              </form>

              <div className='items-center flex gap-4 mr-8 text-white'>
                  

                  {username ? (
                      <div className="flex items-center gap-2 ">
                            <div className="flex items-center gap-2 hover:text-blue-300 cursor-pointer">
                                <p className="text-2xl "><FaUser /></p>
                                <div className="text-sm poppins-semibold">
                                    <span className="font-semibold leading-3">¡Hola, </span>
                                    <p className="text-blue-500 hover:text-blue-200 flex items-center leading-3">{username} <span className="text-white">!</span></p> 
                                    
                                </div>
                            </div>
                      </div>
                  ) : (
                        <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer">
                            <p className="text-2xl"><FaUser /></p>
                            <Link to='/login' className="text-sm font-semibold leading-tight" style={{ lineHeight: '1.1' }}>
                                ¡Hola! Iniciá sesión <br />
                                <span className="font-normal">O registrate gratis.</span>
                            </Link>
                        </div>
                      
                  )}

                    {!loading && userData?.role === 'ADMIN' && ( // Solo mostrar si userData no es null
                        <button
                            onClick={handleRedirectToDashboard}
                            className="text-xl bg-blue-800 hover:bg-blue-400 poppins-light text-white px-3 py-2 rounded-full mt-2 flex items-center gap-2"
                        >
                            <FaChartPie />
                        </button>
                    )}

                  <div className="relative">
                      <Link to='/cart' className="text-2xl" style={{ lineHeight: '1.1' }}>
                          <FaShoppingCart />
                      </Link>
                      <span className="absolute -top-2 -right-3.5 bg-blue-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          0
                      </span>
                  </div>
                  
              </div>
          </div>
          <div className="bg-sub-nav text-white text-md p-2">
              <div className='items-center poppins-semibold flex gap-4 justify-center'>
                  <button onClick={handleToggle} className="hover:text-blue-700 flex items-center">
                      Categorías{isOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                  </button>
                  <Link to='/combo' className="hover:text-blue-700 cursor-pointer">Combos</Link>
                  <Link to='/contacto' className="hover:text-blue-700 cursor-pointer">Contacto</Link>
              </div>
          </div>
      </header>
  );
};


// Validación de props para el componente NavbarClient
NavbarClient.propTypes = {
  toggleMenu: PropTypes.func.isRequired, // 'toggleMenu' debe ser una función requerida
};

export default NavbarClient;
