import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";

const useCart = () => {
    const { user } = useUser();
    const username = user?.username;

    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem(`cart-${username}`);
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const storedCart = localStorage.getItem(`cart-${username}`);
        setCart(storedCart ? JSON.parse(storedCart) : []);
        calTotal(storedCart ? JSON.parse(storedCart) : []);
    }, [username]); // Se agrega username como dependencia

    useEffect(() => {
        if (username) {
            const cartKey = `cart-${username}`;
            localStorage.setItem(cartKey, JSON.stringify(cart));
            console.log(`Carrito guardado en ${cartKey}:`, JSON.parse(localStorage.getItem(cartKey)));
        }
        calTotal(cart);
    }, [cart, username]);

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
        if (username) {
            localStorage.removeItem(`cart-${username}`);
        }
    };
    const calTotal = (cart) => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    };

    return { cart, addItem, removeItem, clearCart, total };
};

export default useCart;