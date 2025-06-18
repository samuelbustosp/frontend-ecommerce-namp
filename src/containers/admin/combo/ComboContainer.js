import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import ErrorModal from "../../../components/admin/ErrorModal";
import { FaSearch } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import ComboList from "../../../components/admin/combo/ComboList"
import ComboModal from "../../../components/admin/combo/ComboModal"
import { useUser } from "../../../contexts/UserContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ComboContainer = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useUser();
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
          const response = await fetch(`${backendUrl}/api-namp/product`);
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
    fetchCombo();
    fetchProducts();
  }, []);

  const fetchCombo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api-namp/combo`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Error al obtener los combos');
      }
      const data = await response.json();
      setCombos(data);
    } catch (error) {
      console.error('FetchCombo Error:', error);
      setError(error.message);
      setIsErrorModalOpen(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800); 
    }
  };

  const addCombo = async (combo, file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('combo', JSON.stringify(combo));
      formData.append('file', file);

      const response = await fetch(`${backendUrl}/api-namp/admin/combo`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include'
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

        throw new Error(errorMessage || 'Error al agregar el combo');
      }
      
      await fetchCombo();
      
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
      setIsErrorModalOpen(true); 
    } finally {
      setLoading(false);
    }
  };

  const updateCombo = async (id, updatedCombo, file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('combo', JSON.stringify(updatedCombo));
      if (file) formData.append('file', file);
  
      const response = await fetch(`${backendUrl}/api-namp/admin/combo/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText.includes("messageTemplate=") 
          ? extractMessageTemplate(errorText) 
          : errorText;
        throw new Error(errorMessage || 'Error al actualizar el combo');
      }

     
  
      await fetchCombo();
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };


  const deleteCombo = async (id) => {
    setLoading(true);
    try {
        
        const response = await fetch(`${backendUrl}/api-namp/admin/combo/${id}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include'
        });

        console.log("Delete response status:", response.status);

        if (!response.ok) {
            throw new Error('Error al eliminar el combo');
        }

        
        await fetchCombo();
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

  const handleAddComboClick = () => {
    setEditingCombo(null);
    setIsModalOpen(true);
  };

  const editComboHandler = (productCombo) => {
    setEditingCombo(productCombo);
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
          onClick={handleAddComboClick}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-2 flex items-center"
        >
          <span><IoMdAdd/></span>
          Agregar
        </button>
      </div>
      <ComboList
        combos={combos}
        addCombo={addCombo}
        onEditCombo={editComboHandler}
        deleteCombo={deleteCombo}
      />
      <ComboModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCombo={addCombo}
        onUpdateCombo={updateCombo}
        comboToEdit={editingCombo}
      />
      <ErrorModal 
        isErrorModalOpen={isErrorModalOpen && error !== null} closeErrorModal={closeErrorModal} 
        error={error}
      />
      
    </div>
  );
}
 
export default ComboContainer;