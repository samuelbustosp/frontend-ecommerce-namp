import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaChevronDown, FaChevronUp } from "react-icons/fa"; 
import { MdLocalShipping } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../../components/client/assets/logo-namp-bl.png";
import useUserRole from "../../hooks/user/useUserRole";
import CartWidget from "./cart/CartWidget";
import {useUser} from "./../../contexts/UserContext"


const NavbarClient = ({ toggleMenu }) => {
    const [isOpen, setIsOpen] = useState(false);
    const {user, logout} = useUser();
    const navigate = useNavigate();
    

    const handleToggle = () => {
        setIsOpen(!isOpen);
        toggleMenu();
    };

    const handleRedirectToDashboard = () => {
        navigate("/dashboard"); // Redirige a la página de dashboard
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
      <div className="bg-nav flex items-center justify-between gap-3 p-4">
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

        <div className='items-center flex gap-3 mr-8 text-white'>
          <p className="text-2xl"><FaUser /></p>
          {user ? (
            <div className="flex flex-col text-sm">
              <span className="font-semibold leading-tight">¡Hola, {user.username}!</span>
              <button onClick={logout} className="text-red-500 font-medium">Cerrar sesión</button>
            </div>
          ) : (
            <Link to='/login' className="text-sm font-semibold leading-tight" style={{ lineHeight: '1.1' }}>
              ¡Hola! Iniciá sesión <br /> 
              <span className="font-normal">O registrate gratis.</span>
            </Link>
          )}
          
          <div className="relative">
            <CartWidget/>
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
