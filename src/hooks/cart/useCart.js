import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";

const useCart = () => {
    const { user, token } = useUser();
    
    const username = user?.username;

    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem(`cart-${username}`);
        return storedCart ? JSON.parse(storedCart) : [];
    });
    
    const [subtotal, setSubtotal] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const storedCart = localStorage.getItem(`cart-${username}`);
        const storedCoupon = localStorage.getItem(`coupon-${username}`);
        
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        const parsedCoupon = storedCoupon ? JSON.parse(storedCoupon) : null;
        
        setCart(parsedCart);
        setAppliedCoupon(parsedCoupon);
        calculateTotals(parsedCart, parsedCoupon);
    }, [username]);

    useEffect(() => {
        if (username) {
            const cartKey = `cart-${username}`;
            localStorage.setItem(cartKey, JSON.stringify(cart));
            console.log(`Carrito guardado en ${cartKey}:`, JSON.parse(localStorage.getItem(cartKey)));
        }
        calculateTotals(cart, appliedCoupon);
    }, [cart, username]);

    useEffect(() => {
        if (username && appliedCoupon) {
            const couponKey = `coupon-${username}`;
            localStorage.setItem(couponKey, JSON.stringify(appliedCoupon));
        }
        calculateTotals(cart, appliedCoupon);
    }, [appliedCoupon, username]);

    const calculateTotals = (cartItems, coupon) => {
        const newSubtotal = cartItems.reduce((acc, item) => {
            // Si el producto tiene promoción activa, usar sellingPrice, sino usar price
            const effectivePrice = item.sellingPrice && item.sellingPrice !== item.price 
                ? item.sellingPrice 
                : item.price;
            
            return acc + effectivePrice * item.quantity;
        }, 0);
        
        setSubtotal(newSubtotal);

        let newTotal = newSubtotal;
        if (coupon && coupon.discount) {
            const discountAmount = newSubtotal * (coupon.discount / 100);
            newTotal = newSubtotal - discountAmount;
        }
        setTotal(newTotal);
    };

    const addItem = (item, quantity) => {
        try {
            const { id, type } = item;
            console.log("type", type);
    
            setCart((prevCart) => {
                const existingItem = prevCart.find(
                    (prod) => prod.id === id && prod.type === type
                );
    
                let newCart;
    
                if (existingItem) {
                    newCart = prevCart.map((prod) =>
                        prod.id === id && prod.type === type
                            ? { ...prod, quantity: prod.quantity + quantity }
                            : prod
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

    const addCoupon = (coupon) => {
        if (!coupon) {
            console.error("Cupón inválido");
            return false;
        }

        setAppliedCoupon(coupon);
        console.log("Cupón aplicado:", coupon);
        return true;
    };

    const applyCoupon = async (idOrder, coupon) => {
        if (!coupon) return;

        try {
            const response = await fetch(`http://localhost:8080/api-namp/user/order/addCoupon/${idOrder}`,
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ code: coupon }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al aplicar cupón:", errorData.message || response.statusText);
                return false;
            }
        } catch (error) {
            console.error("Error al aplicar el cupón:", error);
            return false;
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        if (username) {
            const couponKey = `coupon-${username}`;
            localStorage.removeItem(couponKey);
        }
    };

    const clearCart = () => {
        if (username) {
            localStorage.removeItem(`cart-${username}`);
            localStorage.removeItem(`coupon-${username}`);
        }
        setCart([]);
        setAppliedCoupon(null);
    };

    // Función helper para obtener el descuento aplicado
    const getDiscountAmount = () => {
        if (!appliedCoupon || !appliedCoupon.discount) return 0;
        return subtotal * (appliedCoupon.discount / 100);
    };

    // Función helper para obtener el precio efectivo de un item
    const getEffectivePrice = (item) => {
        return item.sellingPrice && item.sellingPrice !== item.price 
            ? item.sellingPrice 
            : item.price;
    };

    // Función helper para verificar si un item tiene promoción
    const hasPromotion = (item) => {
        return item.sellingPrice && item.sellingPrice !== item.price;
    };

    return { 
        cart, 
        addItem, 
        removeItem, 
        clearCart, 
        total,
        subtotal,
        appliedCoupon,
        applyCoupon,
        addCoupon,
        removeCoupon,
        getDiscountAmount,
        getEffectivePrice,
        hasPromotion
    };
};

export default useCart;