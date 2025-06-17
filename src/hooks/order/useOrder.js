import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import useFetchUserById from "../user/useFetchUserById";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useOrder = () => {
  const { user, token } = useUser();
  console.log(user,"usuario")
  console.log('token',token)
  const { idUser, error: userError } = useFetchUserById(user.username, token);
  console.log('id',idUser)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   
  const createOrder = async () => {
    if (!user) {
      setError("Debes iniciar sesión para hacer una compra.");
      return;
    }

    if (!token) {
      setError("No se ha encontrado el token de autenticación.");
      return;
    }

    if (!idUser) {
      setError(userError || "No se pudo obtener el ID del usuario.");
      return;
    }

    setLoading(true);
    setError(null);

    const orderDTO = {
      idUser: {
        idUser: idUser, // Estructura correcta
      },
    };
    console.log("data", orderDTO);

    try {
      const orderResponse = await fetch(`${backendUrl}/api-namp/user/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderDTO),
      });
      
      console.log("status:", orderResponse.status);

      // Verificar si la respuesta es JSON antes de parsearla
      const contentType = orderResponse.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await orderResponse.text();
        throw new Error(`Respuesta inesperada del servidor: ${errorText}`);
      }

      const orderData = await orderResponse.json();
      console.log("response body:", orderData);

      if (!orderResponse.ok) {
        throw new Error(`Error al crear la orden: ${orderResponse.status} - ${orderData.message || "Sin detalles"}`);
      }

      return orderData;
    } catch (error) {
      console.error("Error en createOrder:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

export default useOrder;
