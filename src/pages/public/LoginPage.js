import React, { useState } from "react";
import Login from "../../components/admin/auth/Login";


const LoginPage = () => {
    const [token, setToken] = useState(null); // Estado para el token
    return (
        <div className="bg-gradient-to-b from-gray-300 to-blue-900 h-screen justify-center items-center">
             <Login setToken={setToken} />
        </div>
    );
};

export default LoginPage;
