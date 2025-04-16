import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

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

    const orderDetails = cart.map(item => ({
        idOrder: { idOrder: idOrder },  // Asegúrate de que idOrder sea un objeto con la propiedad idOrder
        idProduct: { idProduct: item.id },  // Asegúrate de que idProduct sea un objeto con la propiedad idProduct
        quantity: item.quantity,  // Mantén la cantidad tal como está
      }));
      
      console.log('orderDetails', orderDetails);  // Verifica la estructura de orderDetails

    try {
      await Promise.all(
        orderDetails.map(detail =>
          fetch("http://localhost:8080/api-namp/user/orderDetail", {
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
