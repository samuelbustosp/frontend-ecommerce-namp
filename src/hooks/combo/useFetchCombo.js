import { useEffect, useState } from "react";

const useFetchCombo = () => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCombos = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api-namp/combo')
                if (!response.ok){
                    throw new Error("Error al traer los combos");
                }
                const data = await response.json();
                setCombos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setTimeout(()=>{
                    setLoading(false);
                },800)
            }
        }
        fetchCombos();
    }, [])

    return {combos, loading, error};
}
 
export default useFetchCombo;