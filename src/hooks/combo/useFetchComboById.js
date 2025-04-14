import { useEffect, useState } from "react";

const useFetchComboById = (idCombo) => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const res = await fetch("http://localhost:8080/api-namp/comboWithProductCombo");
                if (!res.ok) throw new Error("Error al obtener combos");

                const data = await res.json();

                // Calculamos si hay stock en todos los productos del combo
                const combosWhithStock = data.map(combo => {
                    const hasStock = combo.productCombo.every(
                        pc => pc.idProduct.stock > 0
                        
                    );
                    const productList = combo.productCombo.map(pc => `x${pc.quantity} ${pc.idProduct.name}`).join(", ");
                    return { ...combo, hasStock, productList };
                });

                setCombos(combosWhithStock);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCombos();
    }, []);

    return {combos, loading, error};
}
 
export default useFetchComboById;