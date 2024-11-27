import { useEffect, useState } from "react";
import ProductComboModal from "../../../components/admin/productCombo/ProductComboModal";
import PropTypes from 'prop-types';
import { Spinner } from "flowbite-react";

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
                    const response = await fetch(`http://localhost:8080/api-namp/productCombo/${idCombo}`);
                    if (response.ok) {
                        const data = await response.json();
                        setProductCombos(data);
                    } else {
                        console.error("Error al obtener productCombos");
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
            const response = await fetch("http://localhost:8080/api-namp/product", {
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
            const response = await fetch("http://localhost:8080/api-namp/combo", {
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
            const response = await fetch("http://localhost:8080/api-namp/productCombo", {
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
            const response = await fetch("http://localhost:8080/api-namp/productCombo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
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
            const response = await fetch(`http://localhost:8080/api-namp/productCombo/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
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

    const extractMessageTemplate = (errorText) => {
        const regex = /messageTemplate='([^']+)'/;
        const match = errorText.match(regex);
        return match ? match[1] : null;
    };

    const handleAddProductComboClick = () => {
        setEditingProductCombo(null);
        setIsModalOpen(true);
    };

    const editProductComboHandler = (subcategory) => {
        setEditingProductCombo(subcategory);
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
            />
        </div>
    );
}


export default ProductComboContainer;
