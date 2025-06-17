import { useEffect, useState } from "react";
import CategoryList from "../../../components/admin/category/CategoryList";
import AddCategoryModal from "../../../components/admin/category/AddCategoryModal";
import { Spinner } from 'flowbite-react'; 
import { IoMdAdd } from "react-icons/io";
import ErrorModal from "../../../components/admin/ErrorModal";
import { FaSearch } from "react-icons/fa";
import { useUser } from "../../../contexts/UserContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CategoryContainer = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
    const [searchTerm, setSearchTerm] = useState("");
    const { token } = useUser();


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api-namp/category`);
            if (!response.ok) {
                throw new Error('Error al traer las categorías');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true);
        } finally {
            setTimeout(()=>{
                setLoading(false);
            },800)
        }
    };

    const addCategory = async (newCategory) => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api-namp/admin/category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newCategory)
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

                throw new Error(errorMessage || 'Error al agregar la categoría');
            }
            await fetchCategories();
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (id, updateCategory) => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api-namp/admin/category/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateCategory)
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

                throw new Error(errorMessage || 'Error al actualizar la categoría');
            }
            await fetchCategories();
            setIsModalOpen(false); 
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api-namp/admin/category/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la categoría');
            }
            await fetchCategories();
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

    const handleAddCategoryClick = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const editCategoryHandler = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setError(null);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    onClick={handleAddCategoryClick}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-2 flex items-center"
                >
                    <span><IoMdAdd/></span>
                    Agregar
                </button>
            </div>
            <CategoryList
                categories={filteredCategories}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
                addCategory={addCategory}
                onEditCategory={editCategoryHandler}
            />
            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                categoryToEdit={editingCategory}
            />
            <ErrorModal 
                isErrorModalOpen={isErrorModalOpen} closeErrorModal={closeErrorModal} 
                error={error}
            />
        </div>
    );
};

export default CategoryContainer;
