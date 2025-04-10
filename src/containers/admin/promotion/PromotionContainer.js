import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";

const PromotionContainer = () => {
    const [promotions, setPromotions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const {token} = useUser();

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api-namp/promotion");
            if(!response.ok){
                throw new Error('Error al traer las promociones');
            }
            const data = await response.json();
            setPromotions(data);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true);
        } finally {
            setTimeout(()=>{
                setLoading(false);
            },800)
        }
    }

    const addPromotion = async (newPromotion) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api-namp/admin/promotion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newPromotion)
            });
            if (!response.ok) {
                const errorText = await response.text();

                // Verificamos si el mensaje contiene el formato de 'messageTemplate'
                let errorMessage;
                if (errorText.includes("messageTemplate=")) {
                    errorMessage = extractMessageTemplate(errorText);
                } else {
                    errorMessage = errorText; // Es un mensaje de error simple
                }

                throw new Error(errorMessage || 'Error al agregar la promoción');
            }
            await fetchPromotions();
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };



    const updateCategory = async (id, updatePromotion) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api-namp/admin/promotion/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatePromotion)
            });
            if (!response.ok) {
                const errorText = await response.text();

                // Verificamos si el mensaje contiene el formato de 'messageTemplate'
                let errorMessage;
                if (errorText.includes("messageTemplate=")) {
                    errorMessage = extractMessageTemplate(errorText);
                } else {
                    errorMessage = errorText; // Es un mensaje de error simple
                }

                throw new Error(errorMessage || 'Error al actualizar la promoción');
            }
            await fetchPromotions();
            setIsModalOpen(false); 
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };

    const deletePromotion = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api-namp/admin/promotion/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la promoción');
            }
            await fetchPromotions();
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };

    // Función para extraer el `messageTemplate` del texto de error
    const extractMessageTemplate = (errorText) => {
        // Expresión regular para extraer el contenido del `messageTemplate`
        const regex = /messageTemplate='([^']+)'/;
        const match = errorText.match(regex);
        return match ? match[1] : null;
    };

    const handleAddPromotionClick = () => {
        setEditingPromotion(null);
        setIsModalOpen(true);
    };

    const editPromotionHandler = (promotion) => {
        setEditingPromotion(promotion);
        setIsModalOpen(true);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setError(null);
    };




}

export default PromotionContainer;