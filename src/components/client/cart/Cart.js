import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import { useCartContext } from "../../../contexts/CartContext";
import useOrder from "../../../hooks/order/useOrder";
import useOrderDetail from "../../../hooks/order/useOrderDetail";
import { useState } from "react";

const Cart = () => {
  const { cart, clearCart, total } = useCartContext();
  const { createOrder, loading: orderLoading, error: orderError } = useOrder();
  const { createOrderDetails, loading: detailLoading, error: detailError } = useOrderDetail();
  const [success, setSuccess] = useState(false);

  console.log('cart',cart)

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  if (totalQuantity === 0) {
    return (
      <div className="center-container">
        <div className="text-center mt-8">
          <h1 className="text-xl font-semibold mb-2">No hay items en el carrito!</h1>
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full">
            <Link to="/">Volver a la tienda</Link>
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    const order = await createOrder();
    if (!order) return;
    console.log('order',order)
    await createOrderDetails(order.idOrder, cart);
    
    clearCart();
    setSuccess(true);
  };

  return (
    <div className="center-container">
      <div className="mt-8 p-4 flex">
        <div className="w-2/3 pr-4">
          <h2 className="text-2xl font-semibold mb-4">Carrito de Compras</h2>
          {cart.map((product, index) => (
            <div key={index}>
              <CartItem {...product} />
              <hr className="my-2" />
            </div>
          ))}
          <button
            onClick={clearCart}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 mt-4 rounded-full"
          >
            Limpiar Carrito
          </button>
        </div>

        <div className="w-1/3 border rounded p-4">
          <h2 className="text-2xl font-semibold mb-4">Resumen de Compra</h2>
          <p className="text-gray-600">Artículos en el carrito: {totalQuantity}</p>
          <p className="text-gray-600">Total: ${total}</p>

          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 mt-4 rounded-full"
            onClick={handleCheckout}
            disabled={orderLoading || detailLoading}
          >
            {orderLoading || detailLoading ? "Procesando..." : "Checkout"}
          </button>

          <Link to="/">
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 mt-8 rounded-full">
              Seguir comprando
            </button>
          </Link>

          {orderError && <p className="text-red-500 mt-2">Error: {orderError}</p>}
          {detailError && <p className="text-red-500 mt-2">Error: {detailError}</p>}
          {success && <p className="text-green-500 mt-2">¡Compra realizada con éxito!</p>}
        </div>
      </div>
    </div>
  );
};

export default Cart;
