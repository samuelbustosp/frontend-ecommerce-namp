import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { Spinner } from 'flowbite-react'; 
import { IoMdAdd } from "react-icons/io";
import ErrorModal from "../../../components/admin/ErrorModal";
import { FaSearch } from "react-icons/fa";
import DiscountCouponModal from "../../../components/admin/discountCoupon/DiscountCouponModal";
import DiscountCouponList from "../../../components/admin/discountCoupon/DiscountCouponList";

const DiscountCouponContainer = () => {
    const [discountCoupons, setDiscountCoupons] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDiscountCoupon, setEditingDiscountCoupon] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const {token} = useUser();
    console.log(token)
    

    useEffect(() => {
        fetchDiscountCoupons();
    }, []);

    const fetchDiscountCoupons = async () => {
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api-namp/coupon"
            );

            if(!response.ok){
                throw new Error('Error al traer los cupones de descuento');
            }

            const data = await response.json();
            
            setDiscountCoupons(data);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true);
        } finally {
            setTimeout(()=>{
                setLoading(false);
            },800)
        }
    }

    const addDiscountCoupon = async (newDiscountCoupon) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api-namp/admin/coupon", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newDiscountCoupon)
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

                throw new Error(errorMessage || 'Error al agregar el cupon de descuento');
            }
            await fetchDiscountCoupons();
            setIsModalOpen(false);
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };

    const updateDiscountCoupon = async (id, updateDiscountCoupon) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api-namp/admin/coupon/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateDiscountCoupon)
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

                throw new Error(errorMessage || 'Error al actualizar el cupón de descuento');
            }
            await fetchDiscountCoupons();
            setIsModalOpen(false); 
        } catch (error) {
            setError(error.message);
            setIsErrorModalOpen(true); 
        } finally {
            setLoading(false);
        }
    };

    const deleteDiscountCoupon = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api-namp/admin/coupon/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el cupon de descuneto');
            }
            await fetchDiscountCoupons();
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

    const handleAddDiscountCouponClick = () => {
        setEditingDiscountCoupon(null);
        setIsModalOpen(true);
    };

    const editDiscountCouponHandler = (discountCoupon) => {
        setEditingDiscountCoupon(discountCoupon);
        setIsModalOpen(true);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setError(null);
    };

    const filteredDiscountCoupons = discountCoupons.filter (discountCoupon => 
        discountCoupon.code.toLowerCase().includes(searchTerm.toLowerCase())
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
                            placeholder="Buscar por codigo..."
                            className="p-2 ml-4 border border-gray-300 rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        <FaSearch className="text-lg text-zinc-700 ml-1.5"/>
                    </div>
                    
                    <button
                        onClick={handleAddDiscountCouponClick}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-2 flex items-center"
                    >
                        <span><IoMdAdd/></span>
                        Agregar
                    </button>
                </div>
                <DiscountCouponList /*CAMBIAR ESTO POR EL LIST DE DISCOUTN COUPON */
                    discountCoupons={filteredDiscountCoupons}
                    updateDiscountCoupon={updateDiscountCoupon}
                    deleteDiscountCoupon={deleteDiscountCoupon}
                    addDiscountCoupon={addDiscountCoupon}
                    onEditDiscountCoupon={editDiscountCouponHandler}
                />
                <DiscountCouponModal  /*CAMBIAR ESTO POR EL LIST DE DISCOUTN COUPON */
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddDiscountCoupon={addDiscountCoupon}
                    onUpdateDiscountCoupon={updateDiscountCoupon}
                    discountCouponToEdit={editingDiscountCoupon}
                />
                <ErrorModal 
                    isErrorModalOpen={isErrorModalOpen} closeErrorModal={closeErrorModal} 
                    error={error}
                />
            </div>
        );
  
};

export default DiscountCouponContainer;