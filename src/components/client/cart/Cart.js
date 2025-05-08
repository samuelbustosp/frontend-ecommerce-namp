import { Link, useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import { useCartContext } from "../../../contexts/CartContext";
import useOrder from "../../../hooks/order/useOrder";
import useOrderDetail from "../../../hooks/order/useOrderDetail";
import { useState, useEffect } from "react";
import { TbShoppingBagSearch } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";

const Cart = () => {
  const [order, setOrder] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false)
  const { cart, clearCart, total } = useCartContext();
  const { createOrder, loading: orderLoading, error: orderError } = useOrder();
  const { createOrderDetails, loading: detailLoading, error: detailError } = useOrderDetail();
  const navigate = useNavigate();

  const [buttonState, setButtonState] = useState("normal"); // normal, loading, circle, success

  useEffect(() => {
    if (buttonState === "circle") {
      setTimeout(() => {
        setButtonState("success");
      }, 400);
    }
    if (buttonState === "success") {
      setTimeout(() => {
        navigate(`/order/${order.idOrder}`);
        clearCart();
      }, 1000);
    }
  }, [buttonState, navigate, clearCart]);

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  if (totalQuantity === 0) {
    return (
      <div className="min-h-screen text-center mt-8">
        <h1 className="text-xl font-semibold mb-2">No hay items en el carrito!</h1>
        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full">
          <Link to="/">Volver a la tienda</Link>
        </button>
      </div>
    );
  }

  const handleCheckout = async () => {
    setButtonState("loading");
    try {
      const orderResponse = await createOrder();
      if (!orderResponse || !orderResponse.idOrder) throw new Error("No se pudo crear la orden");
  
      setOrder(orderResponse); // Guarda la orden en el estado, pero no dependas de ella inmediatamente
  
      await createOrderDetails(orderResponse.idOrder, cart); // Usa orderResponse en lugar de order
      setButtonState("circle");
    } catch (error) {
      console.error(error);
      setButtonState("normal");
    }
  };
  

  const getButtonClasses = () => {
    const baseClasses = "relative flex items-center justify-center transition-all duration-300 text-white font-medium";
    switch (buttonState) {
      case "loading":
        return `${baseClasses} bg-emerald-700 py-2 sm:py-3 rounded w-full`;
      case "circle":
        return `${baseClasses} bg-green-500 h-12 w-12 rounded-full mx-auto`;
      case "success":
        return `${baseClasses} bg-green-500 h-12 w-12 rounded-full mx-auto`;
      default:
        return `${baseClasses} bg-emerald-700 hover:bg-green-700 py-2 sm:py-3 rounded w-full`;
    }
  };

  const getButtonContent = () => {
    switch (buttonState) {
      case "loading":
        return (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </>
        );
      case "circle":
        return null;
      case "success":
        return (
          <svg className="w-6 h-6 text-white animate-appear" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      default:
        return "Confirmar";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mt-8 p-4 flex gap-3">
        <div className="w-3/4 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl poppins-semibold mb-2">Carrito de compras</h2>
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
              <button className="p-2 rounded-lg bg-blue-900 poppins-regular text-sm text-white flex items-center gap-1">
                <span className="text-xl"><TbShoppingBagSearch/></span> Seguir comprando
              </button>
            </Link>
          </div>
        </div>

        <div className="w-1/3 bg-white rounded-lg p-4 shadow-lg flex flex-col h-full">
          <h2 className="text-2xl poppins-semibold mb-2">Resumen de Compra</h2>
          <hr className="mb-4"/>

          <div className="p-3 flex-grow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-800 poppins-regular">Productos ({totalQuantity}):</span>
              <span className="text-gray-800 poppins-semibold">${total}</span>
            </div>
            <div>
              <button 
                onClick={() => setShowCouponInput(true)}
                className="poppins-semibold text-sm text-blue-800 cursor-pointer"
              >
                Ingresar Cupón
              </button>

              {showCouponInput && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ingresa el cupón de descuento"
                    className="w-full px-3 py-1 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button className=" text-white p-1 rounded-xl bg-blue-900 poppins-semibold"
                  >
                    <FaPlus/>
                  </button>
                </div>
              )}
            </div>
            
          </div>

          <div className="mt-auto">
            <h1 className="text-gray-900 poppins-bold text-xl mb-2">Total: ${total}</h1>
            <div className="flex items-center">
              <button
                className={getButtonClasses()}
                onClick={handleCheckout}
                disabled={orderLoading || detailLoading || buttonState !== "normal"}
              >
                {getButtonContent()}
              </button>
            </div>
          </div>

          {orderError && <p className="text-red-500 mt-2">Error: {orderError}</p>}
          {detailError && <p className="text-red-500 mt-2">Error: {detailError}</p>}
        </div>
      </div>
    </div>
  );
};

export default Cart;
