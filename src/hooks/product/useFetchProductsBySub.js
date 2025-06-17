import { useEffect, useState } from "react";

const useFetchProductBySubcategory = (subcategoryName) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!subcategoryName) return; // evitar fetch innecesario si no hay nombre

        const fetchBySubcategory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api-namp/product`);
                if (!response.ok) throw new Error('Error al traer los productos');

                const data = await response.json();

                const filtered = data.filter(prod => 
                    prod.idSubcategory.name?.toLowerCase() === subcategoryName.toLowerCase()
                );

                setProducts(filtered);
            } catch (error) {
                setError(error.message);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            }
        };

        fetchBySubcategory();
    }, [subcategoryName]);

    return { products, error, loading };
};

export default useFetchProductBySubcategory;
