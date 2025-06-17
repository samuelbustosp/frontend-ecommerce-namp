import { useEffect, useState } from "react";
import ProductComboModal from "../../../components/admin/productCombo/ProductComboModal";
import PropTypes from 'prop-types';
import { Spinner } from "flowbite-react";
import { useUser } from "../../../contexts/UserContext";


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ProductComboContainer = ({ onClose, idCombo }) => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProductCombo, setEditingProductCombo] = useState(null);
    const [productCombos, setProductCombos] = useState([]);
    const { token } = useUser();
    const [allProductCombos, setAllProductCombos] = useState([]); // para todos
    
    useEffect(() => {
        fetchProductCombo();
        fetchProducts();
        fetchCombos();
    }, []);

    useEffect(() => {
        if (idCombo) {
            // Fetch existing productCombos for this combo
            const fetchProductCombos = async () => {
                try {
                    const response = await fetch(`${backendUrl}/api-namp/comboWithProductCombo/${idCombo}`);
                    if (response.ok) {
                        const data = await response.json();
                        setProductCombos(data);
                    } else {
                        console.error("Error al obtener los items del combo");
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                }
            };
            fetchProductCombos();
        }
    }, [idCombo]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${backendUrl}/api-namp/product`, {
                method: 'GET',
                mode: 'cors'
            });
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true);
        }
    };

    const fetchCombos = async () => {
        try {
            const response = await fetch(`${backendUrl}/api-namp/combo`, {
                method: 'GET',
                mode: 'cors'
            });
            if (!response.ok) {
                throw new Error('Error al obtener los combos');
            }
            const data = await response.json();
            setCombos(data);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true);
        }
    };

    const fetchProductCombo = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api-namp/productCombo`, {
                method: 'GET',
                mode: 'cors'
            });
            if (!response.ok) {
                throw new Error('Error al obtener los productCombo');
            }
            const data = await response.json();
           
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const addProductCombo = async (newProductCombo) => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api-namp/admin/productCombo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newProductCombo)
            });
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;
                if (errorText.includes("messageTemplate=")) {
                    errorMessage = extractMessageTemplate(errorText);
                } else {
                    errorMessage = errorText;
                }
                throw new Error(errorMessage || 'Error al agregar el producto');
            }
            await fetchProductCombo();
            onClose(); 
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const updateProductCombo = async (id, updatedProductCombo) => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api-namp/admin/productCombo/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProductCombo)
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
                throw new Error(errorMessage || 'Error al actualizar el item combo');
            }
            await fetchProductCombo();
            setIsModalOpen(false); 
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };

    const deleteProductCombo = async (id) => {
        setLoading(true);
        try {
            
            const response = await fetch(`${backendUrl}/api-namp/admin/productCombo/${id}`, {
                method: "DELETE",
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
                credentials: 'include'
            });
    
            console.log("Delete response status:", response.status);
    
            if (!response.ok) {
                throw new Error('Error al eliminar el item del combo');
            }
    
           onClose();
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(false); 
        } finally {
            setLoading(false);
        }
      };

    const extractMessageTemplate = (errorText) => {
        const regex = /messageTemplate='([^']+)'/;
        const match = errorText.match(regex);
        return match ? match[1] : null;
    };

    const handleAddProductComboClick = () => {
        setEditingProductCombo(null);
        setIsModalOpen(true);
    };

    const editProductComboHandler = (combo) => {
        setEditingProductCombo(combo);
        setIsModalOpen(true);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setError(null);
    };

    if (loading) {
        return (
            <div className="bottom-1/2 flex justify-center items-center h-80">
                <Spinner size="lg" />
            </div>
        )
    }

    
    return (
        <div>
            <ProductComboModal
                products={products}
                productCombos={productCombos}
                onAddProductCombo={addProductCombo}
                onUpdateProductCombo={updateProductCombo}
                idCombo={idCombo}
                onClose={onClose}
                productComboToEdit={editingProductCombo}
                combos={combos}
                onDeleteProductCombo={deleteProductCombo}
            />
        </div>
    );
}


export default ProductComboContainer;
