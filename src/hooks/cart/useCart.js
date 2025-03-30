import { useState } from "react";

const useCart = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const addItem = (item, quantity) => {
        try {
            setCart((prevCart) => {
                const existingItem = prevCart.find((prod) => prod.id === item.id);
                let newCart;
    
                if (existingItem) {
                    newCart = prevCart.map((prod) =>
                        prod.id === item.id ? { ...prod, quantity: prod.quantity + quantity } : prod
                    );
                } else {
                    newCart = [...prevCart, { ...item, quantity }];
                }
    
                calTotal(newCart);
                return newCart;
            });
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }
    };

    const removeItem = (itemId) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((prod) => prod.id !== itemId);
            calTotal(updatedCart);
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        setTotal(0);
    };

    const calTotal = (cart) => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    };

    return { cart, addItem, removeItem, clearCart, total };
};

export default useCart;
