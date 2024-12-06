import React, { useState } from "react";
import Login from "../../components/admin/auth/Login";
import logoNav from "./../../components/admin/assets/logo-side.png"

const LoginPage = () => {
    const [token, setToken] = useState(null); // Estado para el token
    return (
        <div className="bg-gradient-to-b from-gray-300 to-blue-900 h-screen justify-center items-center flex flex-col overflow-hidden">
           
            <div className="flex flex-col items-center py-4">
                <img src={logoNav} alt="Logo navbar" className="w-24 rounded-full" />
                <h1 className="poppins-extrabold text-white text-4xl">
                    NAMP<span className="text-blue-900 poppins-semibold"> BEBIDAS
                        <span className="text-blue-900 poppins-extrabold">
                            .
                        </span>
                    </span>
                </h1>
                
            </div>
            <Login setToken={setToken} />
        </div>
    );
};

export default LoginPage;
