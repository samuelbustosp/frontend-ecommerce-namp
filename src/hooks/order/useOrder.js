import { useState } from "react";
import { useCartContext } from "../../contexts/CartContext";
import useUser from "../user/useUser";

const useOrder = () => {
  const { cart, clearCart, total } = useCartContext();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async () => {
    if (!user) {
      setError("Debes iniciar sesión para hacer una compra.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Crear la orden en el backend
      const orderResponse = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUser: user.idUser,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Error al crear la orden.");
      }

      const orderData = await orderResponse.json(); // Obtener la orden creada

      // 2️⃣ Crear los detalles de la orden (OrderDetail)
      const orderDetails = cart.map(item => ({
        idOrder: orderData.idOrder, // ID de la orden creada
        idProduct: item.idProduct,
        quantity: item.quantity,
      }));

      await Promise.all(
        orderDetails.map(detail =>
          fetch("http://localhost:8080/api/orderDetail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detail),
          })
        )
      );

      // 3️⃣ Limpiar el carrito después de la compra
      clearCart();

      return orderData; // Devolver la orden creada
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

export default useOrder;
