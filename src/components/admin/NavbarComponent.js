
import { HiMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import PropTypes from 'prop-types';
import useFetchUser from "../../hooks/user/useUserRole";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";

const NavbarComponent = ({toggleSidebar}) => {
    const [username, setUsername] = useState(null); 
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
          console.log(payload); // Para verificar la información del token
            

          setUsername(payload.sub); // El nombre de usuario (subject)
            
        } else {
          setUsername(null);
            
        }
    }, []);
    const handleClick = () => {
        toggleSidebar();
    };
    
    
    return ( 
        <header className="bg-nav flex items-center justify-between py-4 z-10">
            <span onClick={handleClick} className="cursor-pointer p-2">
                <HiMenu className="text-white w-6 h-6" />
                <span className="sr-only">Toggle navigation</span>
            </span>
            <nav className=" text-white poppins-semibold p-2 flex items-center cursor-default">
                <div className='items-center flex gap-3 mr-8'>
                    <p href='/username' className="text-3xl "><FaUserCircle/></p>
                    <p href='/'className="text-base" >{username}</p>
                </div>
                
            </nav>
            
        </header>
     );
}

NavbarComponent.propTypes = {
    toggleSidebar: PropTypes.func.isRequired
};

export default NavbarComponent;