import { useEffect, useState } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useFetchSubcategory = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubcategories = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${backendUrl}/api-namp/subcategory`);
                if (!response.ok) {
                    throw new Error('Error al traer las subcategorías');
                }
                const data = await response.json();
                setSubcategories(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSubcategories();
    }, []);

    return { subcategories, error, loading }; 
}
 
export default useFetchSubcategory;