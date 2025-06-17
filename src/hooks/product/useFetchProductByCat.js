import { useEffect, useState } from "react";


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useFetchProductByCategory = (categoryName) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryName) return;
        const fetchByCategory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${backendUrl}/api-namp/product`);
                if (!response.ok) throw new Error('Error al traer los productos');

                const data = await response.json();

                const filtered = data.filter(prod => 
                    prod.idSubcategory?.idCategory?.name?.toLowerCase() === categoryName.toLowerCase()
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

        fetchByCategory();
    }, [categoryName]);

    return { products, error, loading };
};

export default useFetchProductByCategory;
