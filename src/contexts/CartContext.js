import { createContext, useContext } from "react";
import useCart from "../hooks/cart/useCart";


export const CartContext = createContext();

export const useCartContext = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const cartData = useCart();  
    return (
        <CartContext.Provider value={cartData}>
            {children}
        </CartContext.Provider>
    );
};
