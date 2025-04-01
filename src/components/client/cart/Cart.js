import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import { useCartContext } from "../../../contexts/CartContext";
import useOrder from "../../../hooks/order/useOrder";
import useOrderDetail from "../../../hooks/order/useOrderDetail";
import { useState } from "react";
import { TbShoppingBagSearch } from "react-icons/tb";

const Cart = () => {
  const { cart, clearCart, total } = useCartContext();
  const { createOrder, loading: orderLoading, error: orderError } = useOrder();
  const { createOrderDetails, loading: detailLoading, error: detailError } = useOrderDetail();
  const [success, setSuccess] = useState(false);

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
    <div className="min-h-screen bg-gray-100">
      <div className="mt-8 p-4 flex gap-3">
        <div className="w-3/4 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl poppins-semibold mb-2  ">Carrito de compras</h2>
          <hr className="mb-2"/>
          {cart.map((product, index) => (
            <div key={index} className="py-1">
              <CartItem {...product} />
            </div>
          ))}
          <div className="flex items-center justify-end mt-4 gap-2">
            <button
              onClick={clearCart}
              className="bg-gray-800 hover:bg-gray-900 text-white poppins-regular text-sm py-2 px-4 rounded-full"
            >
              Limpiar carrito
            </button>
            <Link to="/">
              <button className=" p-2 rounded-lg bg-blue-900 poppins-regular text-sm text-white flex items-center gap-1">
                <span className="text-xl"><TbShoppingBagSearch/></span> Seguir comprando
              </button>
            </Link>
            
          </div>
          
        </div>

        <div className="w-1/3 bg-white rounded-lg p-4 shadow-lg flex flex-col h-full">
          <h2 className="text-2xl poppins-semibold mb-2 ">Resumen de Compra</h2>
          <hr className="mb-4" />

          {/* Contenido superior que crece con flex-grow */}
          <div className="p-3 flex-grow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-800 poppins-regular">Productos({totalQuantity}): </span>
              <span className="text-gray-800 poppins-semibold">${total}</span>
            </div>
            <p className="poppins-semibold text-sm text-blue-800">Ingresar Cupón</p>
          </div>

          {/* Sección fija en la parte inferior */}
          <div className="mt-auto">
            <h1 className="text-gray-900 poppins-bold text-xl mb-2">Total: ${total}</h1>
            <div className="flex items-center">
              <button
                className="bg-emerald-700 poppins-semibold hover:bg-green-700 text-white py-2 px-4 rounded-lg w-full"
                onClick={handleCheckout}
                disabled={orderLoading || detailLoading}
              >
                {orderLoading || detailLoading ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>

          {orderError && <p className="text-red-500 mt-2">Error: {orderError}</p>}
          {detailError && <p className="text-red-500 mt-2">Error: {detailError}</p>}
          {success && <p className="text-green-500 mt-2">¡Compra realizada con éxito!</p>}
        </div>
      </div>
    </div>
  );
};

export default Cart;
