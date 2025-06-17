import { useEffect, useState } from "react";

const useFetchCombo = () => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCombos = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api-namp/comboWithProductCombo');
                if (!response.ok) {
                    throw new Error("Error al traer los combos");
                }
                const data = await response.json();

                // Calcular hasStock para cada combo
                const combosWithStock = data.map(combo => {
                    const hasStock = combo.productCombo.every(pc => pc.idProduct.stock > 0);

                    const availableStock = Math.min(
                        ...combo.productCombo.map(pc => Math.floor(pc.idProduct.stock / pc.quantity))
                    )

                    console.log('stock del combo',availableStock)

                    const productList = combo.productCombo.map(pc => `${pc.quantity}x ${pc.idProduct.name}`).join(", ");
                    return { ...combo, hasStock, productList, availableStock };
                });

                setCombos(combosWithStock);
            } catch (error) {
                setError(error.message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            }
        };

        fetchCombos();
    }, []);

    return { combos, loading, error };
};

export default useFetchCombo;
