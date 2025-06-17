import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useFetchComboById = () => {
    const { name } = useParams();
    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCombosId = async () => {
            setLoading(true);
            try {
                // Primer fetch para obtener la lista de combos
                const response = await fetch(`${backendUrl}/api-namp/comboWithProductCombo`);
                if (!response.ok) {
                    throw new Error('Error al traer los combos');
                }
                const data = await response.json();

                // Buscar el combo por nombre
                const foundCombo = data.find(comb => comb.name.toLowerCase() === name.toLowerCase());

                if (!foundCombo) throw new Error('Combo no encontrado');

                // Segundo fetch para obtener los detalles completos por ID
                const comboResponse = await fetch(`${backendUrl}/api-namp/comboWithProductCombo/${foundCombo.idCombo}`);
                if (!comboResponse.ok) {
                    throw new Error('Error al traer los detalles del combo');
                }

                const comboData = await comboResponse.json();

                // Cálculo de hasStock, availableStock y productList
                const hasStock = comboData.productCombo.every(pc => pc.idProduct.stock > 0);
                const availableStock = Math.min(
                    ...comboData.productCombo.map(pc => Math.floor(pc.idProduct.stock / pc.quantity))
                );
                const productList = comboData.productCombo
                    .map(pc => `${pc.quantity}x ${pc.idProduct.name}`)
                    .join(", ");

                setCombo({ ...comboData, hasStock, availableStock, productList });

            } catch (error) {
                setError(error.message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            }
        };

        fetchCombosId();
    }, [name]);

    return { combo, loading, error };
};

export default useFetchComboById;
