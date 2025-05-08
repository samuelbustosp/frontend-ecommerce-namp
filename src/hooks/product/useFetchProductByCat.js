import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useFetchProductByCategory = (categoryName) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryName) return;
        const fetchByCategory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api-namp/product`);
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
