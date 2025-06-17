import { useEffect, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useFetchOrderById = (id) => {
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;  // Evita llamadas innecesarias si el id es undefined

        const fetchOrderById = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${backendUrl}/api-namp/user/orderWithOrderDetails/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles de la orden');
                }

                const data = await response.json();
                setOrder(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchOrderById();
    }, [id]);

    return { order, error, loading };
};

export default useFetchOrderById;
