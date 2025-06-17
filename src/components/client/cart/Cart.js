import { Link, useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import { useCartContext } from "../../../contexts/CartContext";
import useOrder from "../../../hooks/order/useOrder";
import useOrderDetail from "../../../hooks/order/useOrderDetail";
import { useState, useEffect } from "react";
import { TbShoppingBagSearch } from "react-icons/tb";
import { FaPlus, FaTimes } from "react-icons/fa";
import useFetchCouponByCode from "../../../hooks/coupon/useFetchCouponByCode";

const Cart = () => {
  const [order, setOrder] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  
  const { 
    cart, 
    clearCart, 
    addCoupon,
    total, 
    subtotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    getDiscountAmount 
  } = useCartContext();
  
  const { createOrder, loading: orderLoading, error: orderError } = useOrder();
  const { createOrderDetails, loading: detailLoading, error: detailError } = useOrderDetail();
  const navigate = useNavigate();
  
  console.log('cart', cart);
  console.log('appliedCoupon', appliedCoupon);

  const { coupon, loading: couponLoading } = useFetchCouponByCode(couponCode);
  const [buttonState, setButtonState] = useState("normal");

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

      if (!orderResponse || !orderResponse.idOrder)
        throw new Error("No se pudo crear la orden");

      setOrder(orderResponse);

      if (appliedCoupon) {
        await applyCoupon(orderResponse.idOrder, appliedCoupon.code);
      }

      await createOrderDetails(orderResponse.idOrder, cart);
      setButtonState("circle");
    } catch (error) {
      console.error(error);
      setButtonState("normal");
    }
  };


  const handleAddCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Por favor ingresa un código de cupón');
      return;
    }

    setCouponError('');
    // Esperar a que se obtenga el cupón
    if (coupon) {
      const success = addCoupon(coupon);
      if (success) {
        setShowCouponInput(false);
        setCouponCode('');
      } else {
        setCouponError('Error al aplicar el cupón');
      }
    } else if (!couponLoading) {
      setCouponError('Cupón no válido o no encontrado');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponError('');
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
            <div className="flex items-center justify-between">
              <span className="text-gray-800 poppins-regular">Productos ({totalQuantity}):</span>
              <span className="text-gray-800 poppins-semibold">${subtotal}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 poppins-regular">
                    Descuento ({appliedCoupon.discount}%):
                  </span>
                  
                </div>
                <span className="text-green-600 poppins-semibold">-${getDiscountAmount().toFixed(2)}</span>
              </div>
            )}
            
            <div className="mt-4">
              {!appliedCoupon && (
                <button 
                  onClick={() => setShowCouponInput(true)}
                  className="poppins-semibold text-sm text-blue-800 cursor-pointer hover:text-blue-600"
                >
                  Ingresar Cupón
                </button>
              )}

              {showCouponInput && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={couponCode}
                      type="text"
                      placeholder="Ingresa el cupón de descuento"
                      className="w-full px-3 py-1 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCoupon()}
                    />
                    <button 
                      onClick={handleAddCoupon}
                      disabled={couponLoading}
                      className="text-white p-1 rounded-xl bg-blue-900 poppins-semibold hover:bg-blue-800 disabled:opacity-50"
                    >
                      {couponLoading ? '...' : <FaPlus/>}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1">{couponError}</p>
                  )}
                </div>
              )}

              {appliedCoupon && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                  <span className="text-green-700 text-sm poppins-regular">
                    Cupón aplicado: {appliedCoupon.code || 'Cupón activo'}
                  </span>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="text-green-800 hover:text-green-700"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <h1 className="text-gray-900 poppins-bold text-xl mb-2">Total: ${total.toFixed(2)}</h1>
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