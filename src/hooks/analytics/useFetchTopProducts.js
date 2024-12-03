import { useState, useEffect } from 'react';

const useFetchTopProducts = (limit, startDate, endDate) => {
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const url_base = 'http://localhost:8080/api-namp/admin';

    useEffect(() => {
        const fetchProductsData = async () => {
            setLoading(true);

            try {
                const token = localStorage.getItem('token');

                const start = new Date(startDate).toISOString().split('.')[0]; // "yyyy-MM-ddTHH:mm:ss"
                const end = new Date(endDate).toISOString().split('.')[0];     // "yyyy-MM-ddTHH:mm:ss"
                
                // Construir parámetros dinámicos
                const params = new URLSearchParams();
                params.append('limit', limit);
                if (start) params.append('startDate', start);
                if (end) params.append('endDate', end);

                const url = `${url_base}/getTopProductSold?${params.toString()}`;
                console.log('url',url)
                

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }

                const data = await response.json();
                setProductsData(data); // Guarda los datos
                setError(null); // Resetea el error
            } catch (error) {
                setError(error.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchProductsData();
    }, [limit, startDate, endDate]);

    return { productsData, loading, error };
};


export default useFetchTopProducts;

