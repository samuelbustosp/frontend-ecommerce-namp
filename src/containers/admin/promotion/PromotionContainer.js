import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { Spinner } from 'flowbite-react'; 
import { IoMdAdd } from "react-icons/io";
import ErrorModal from "../../../components/admin/ErrorModal";
import { FaSearch } from "react-icons/fa";
import PromotionList from "../../../components/admin/promotion/PromotionList";
import PromotionModal from "../../../components/admin/promotion/PromotionModal";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
            const response = await fetch(`${backendUrl}/api-namp/promotion`);
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
            const response = await fetch(`${backendUrl}/api-namp/admin/promotion`, {
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



    const updatePromotion = async (id, updatePromotion) => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api-namp/admin/promotion/${id}`, {
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
            const response = await fetch(`${backendUrl}/api-namp/admin/promotion/${id}`, {
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

    const filteredPromotions = promotions.filter (promotion => 
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bottom-1/2 flex justify-center items-center h-80">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
            <div className="mb-4">
                <div className="flex justify-between mr-4 mt-4 gap-2">
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre..."
                            className="p-2 ml-4 border border-gray-300 rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        <FaSearch className="text-lg text-zinc-700 ml-1.5"/>
                    </div>
                    
                    <button
                        onClick={handleAddPromotionClick}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-2 flex items-center"
                    >
                        <span><IoMdAdd/></span>
                        Agregar
                    </button>
                </div>
                <PromotionList
                    promotions={filteredPromotions}
                    updatePromotion={updatePromotion}
                    deletePromotion={deletePromotion}
                    addPromotion={addPromotion}
                    onEditPromotion={editPromotionHandler}
                />
                <PromotionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddPromotion={addPromotion}
                    onUpdatePromotion={updatePromotion}
                    promotionToEdit={editingPromotion}
                />
                <ErrorModal 
                    isErrorModalOpen={isErrorModalOpen} closeErrorModal={closeErrorModal} 
                    error={error}
                />
            </div>
        );
};

export default PromotionContainer;