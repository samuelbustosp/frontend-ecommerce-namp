import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useOrderDetail = () => {
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrderDetails = async (idOrder, cart) => {
    if (!token) {
      setError("No se ha encontrado el token de autenticación.");
      return;
    }

    setLoading(true);
    setError(null);

    const orderDetails = cart.map(item => {
      const base = {
        idOrder: { idOrder },
        quantity: item.quantity,
      };
    
      if (item.type === "combo") {
        return {
          ...base,
          idCombo: { idCombo: item.id },
        };
      } else {
        return {
          ...base,
          idProduct: { idProduct: item.id },
        };
      }
    });
    
      
    console.log('orderDetails', orderDetails);  // Verifica la estructura de orderDetails

    try {
      await Promise.all(
        orderDetails.map(detail =>
          fetch(`${backendUrl}/api-namp/user/orderDetail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(detail),
          })
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createOrderDetails, loading, error };
};

export default useOrderDetail;
