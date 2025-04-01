import { useState, useEffect } from "react";

const useCart = () => {
    const [cart, setCart] = useState(() => {
        // Cargar el carrito desde localStorage al inicializar
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Guardar el carrito en localStorage cada vez que cambie
        localStorage.setItem("cart", JSON.stringify(cart));
        calTotal(cart); // Recalcular el total cada vez que el carrito cambia
    }, [cart]);

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

                return newCart;
            });
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }
    };

    const removeItem = (itemId) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((prod) => prod.id !== itemId);
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const calTotal = (cart) => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    };

    return { cart, addItem, removeItem, clearCart, total };
};

export default useCart;