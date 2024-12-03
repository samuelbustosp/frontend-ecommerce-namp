import { useState, useEffect } from 'react';

const useFetchTopCombos = (limit, startDate, endDate) => {
    const [combosData, setCombosData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const url_base = 'http://localhost:8080/api-namp/admin';

    useEffect(() => {
        const fetchCombosData = async () => {
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

                const url = `${url_base}/getTopComboSold?${params.toString()}`;
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
                setCombosData(data); // Guarda los datos
                setError(null); // Resetea el error
            } catch (error) {
                setError(error.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchCombosData();
    }, [limit, startDate, endDate]);

    return { combosData, loading, error };
};


export default useFetchTopCombos;

