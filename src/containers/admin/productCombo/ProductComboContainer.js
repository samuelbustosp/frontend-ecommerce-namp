import { useEffect, useState } from "react";
import ProductComboModal from "../../../components/admin/productCombo/ProductComboModal";
import PropTypes from 'prop-types';

const ProductComboContainer = ({ onClose, idCombo }) => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProductCombo();
        fetchProducts();
    }, []);

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
            setCombos(data);
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

    const extractMessageTemplate = (errorText) => {
        const regex = /messageTemplate='([^']+)'/;
        const match = errorText.match(regex);
        return match ? match[1] : null;
    };

    return (
        <div>
            <ProductComboModal
                products={products}
                onAddProductCombo={addProductCombo}
                idCombo={idCombo}
                onClose={onClose}
            />
        </div>
    );
}

// Validación de props para el componente ProductComboContainer
ProductComboContainer.propTypes = {
    onClose: PropTypes.func.isRequired,  // 'onClose' debe ser una función requerida
    idCombo: PropTypes.number.isRequired  // 'idCombo' debe ser un número requerido
};
export default ProductComboContainer;
