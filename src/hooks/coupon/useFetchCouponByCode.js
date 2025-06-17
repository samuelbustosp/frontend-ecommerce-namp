import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useFetchCouponByCode = (code) => {
    const [coupon, setCoupon] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {token} = useUser();

    useEffect(() => {
        if (!code) return;  // Evita llamadas innecesarias si el id es undefined
        const fetchCouponByCode = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${backendUrl}/api-namp/user/coupon/${code}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles del cupon');
                }

                const data = await response.json();
                setCoupon(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchCouponByCode();
    }, [code]);

    return { coupon, error, loading };
};

export default useFetchCouponByCode;
