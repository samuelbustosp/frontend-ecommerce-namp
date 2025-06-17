import { useState, useEffect } from 'react';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useFetchSalesForYear = (year) => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalesDataForYear = async () => {
            setLoading(true);

            try {
                const token = localStorage.getItem('token');
                const url = `${backendUrl}/api-namp/admin/getMonthlyIncome?year=${year}`;
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
                setSalesData(data); // Guarda los datos
                setError(null); // Resetea el error
            } catch (error) {
                setError(error.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        if (year) {
            fetchSalesDataForYear();
        }
    }, [year]);

    return { salesData, loading, error };
};

export default useFetchSalesForYear;

