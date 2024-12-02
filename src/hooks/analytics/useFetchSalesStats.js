import { useState, useEffect } from 'react';

const useFetchSalesStats = (startDate, endDate) => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            // Verifica si las fechas son válidas antes de hacer la solicitud
            if (!startDate || !endDate) {
                return;
            }

            setLoading(true); // Comienza la carga

            try {
                // Formatea las fechas al formato requerido por la API
                const start = new Date(startDate).toISOString().split('.')[0]; // "yyyy-MM-ddTHH:mm:ss"
                const end = new Date(endDate).toISOString().split('.')[0];     // "yyyy-MM-ddTHH:mm:ss"
                console.log(start)
                console.log(end)
        
                const url = `http://localhost:8080/api-namp/admin/getDailyIncome?startDate=${start}&endDate=${end}`;
                console.log(url);

                // Recupera el token de autenticación desde el localStorage
                const token = localStorage.getItem('token');  // Ajusta la clave según el nombre que le des al token en localStorage
                console.log(token);

                // Realiza la solicitud con el token en los encabezados
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',  // Especifica que la solicitud es en formato JSON
                    },
                    credentials: 'include'
                });

                // Si la respuesta no es OK (200)
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }

                const data = await response.json();
                setSalesData(data); // Guarda los datos
                setError(null); // Resetea el error en caso de éxito
            } catch (error) {
                setError(error.message || 'Error desconocido');
            } finally {
                setLoading(false); // Termina la carga
            }
        };

        fetchSalesData();
    }, [startDate, endDate]); // Re-ejecutar cuando las fechas cambian

    return { salesData, loading, error };
};

export default useFetchSalesStats;
