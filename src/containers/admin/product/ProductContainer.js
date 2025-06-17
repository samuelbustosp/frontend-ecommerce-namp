import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import ErrorModal from "../../../components/admin/ErrorModal";
import { FaSearch } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import ProductList from "../../../components/admin/product/ProductList"
import ProductModal from "../../../components/admin/product/ProductModal"
import { useUser } from "../../../contexts/UserContext";

const ProductContainer = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { token } = useUser();

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await fetch("http://localhost:8080/api-namp/subcategory");
                if (!response.ok) {
                    throw new Error('Error al obtener las subcategorías');
                }
                const data = await response.json();
                setSubcategories(data);
            } catch (error) {
                setError(error.message);
                setIsErrorModalOpen(true);
            }
        };

        const fetchPromotions = async () => {
            setLoading(true);
    
            try {
                const response = await fetch("http://localhost:8080/api-namp/admin/promotion/validPromotions", {
                    method:'GET',
                    'Authorization': `Bearer ${token}`,
                });
                if(!response.ok){
                    throw new Error('Error al traer las promociones');
                }
                const data = await response.json();
                setPromotions(data);
            } catch (error) {
                setError(error.message);
                setIsErrorModalOpen(true);
            }
        }

        fetchProduct();
        fetchSubcategories();
        fetchPromotions();
    }, []);
    
    
    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api-namp/product", {
                method: 'GET',
                mode: 'cors' 
            });

            if (!response.ok) {
                throw new Error('Error al obtener las subcategorías');
            }

            const data = await response.json();

            setProducts(data);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 800); 
        }
    };

    const addProduct = async (product, file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('product', JSON.stringify(product));
            formData.append('file', file);

            const token = localStorage.getItem('token');  // Ajusta la clave según el nombre que le des al token en localStorage
            console.log(token);

            const response = await fetch("http://localhost:8080/api-namp/admin/product", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
                credentials: 'include',
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

                throw new Error(errorMessage || 'Error al agregar el producto');
            }
            
            await fetchProduct();
            
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id, updatedProduct, file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('product', JSON.stringify(updatedProduct));
            if (file) {
                formData.append('file', file);
            }
    
            const response = await fetch(`http://localhost:8080/api-namp/admin/product/${id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
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
                
                throw new Error(errorMessage || 'Error al actualizar el producto');
            }

            await fetchProduct();
            setIsModalOpen(false); 
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };
    
    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            
            const response = await fetch(`http://localhost:8080/api-namp/admin/product/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }
            await fetchProduct();
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
    

    const handleAddProductClick = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const editProductHandler = (subcategory) => {
        setEditingProduct(subcategory);
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
                    onClick={handleAddProductClick}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-2 flex items-center"
                >
                    <span><IoMdAdd/></span>
                    Agregar
                </button>
            </div>
            <ProductList
                products={products}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
                addProduct={addProduct}
                onEditProduct={editProductHandler}
            />
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                productToEdit={editingProduct}
                subcategories={subcategories}
                promotions = {promotions}
            />
            <ErrorModal 
                isErrorModalOpen={isErrorModalOpen} closeErrorModal={closeErrorModal} 
                error={error}
            />
            
        </div>
    );
}
 
export default ProductContainer;