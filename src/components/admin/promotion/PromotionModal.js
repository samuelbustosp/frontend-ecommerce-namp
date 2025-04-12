import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

const PromotionModal = ({isOpen, onClose, onAddPromotion, onUpdatePromotion, promotionToEdit}) => {
    const [promotion, setPromotion] = useState({
        name: '',
        discount: 0,
        dateTimeStart: '',
        dateTimeEnd: ''
    });

    useEffect(() => {
        if (promotionToEdit) {
            setPromotion({
                name: promotionToEdit.name,
                discount: promotionToEdit.discount,
                dateTimeStart: promotionToEdit.dateTimeStart,
                dateTimeEnd: promotionToEdit.dateTimeEnd
            });
        } else {
            setPromotion({ 
                name: '', 
                discount: 0, 
                dateTimeStart: '', 
                dateTimeEnd: ''
            });
        }
    }, [promotionToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'discount') {
          // Solo permitir entrada numérica para descuento
          const numericValue = value.replace(/[^0-9.]/g, '');
          
          // Asegurar que el valor esté dentro del rango válido (0-100)
          let parsedValue = parseFloat(numericValue);
          if (isNaN(parsedValue)) parsedValue = 0;
          if (parsedValue > 100) parsedValue = 100;
          
          setPromotion(prev => ({
            ...prev,
            discount: parsedValue
          }));
        } else {
          setPromotion(prev => ({
            ...prev,
            [name]: value
          }));
        }
    };

    const formatDateTimeForCreate = (datetime) => {
        const date = new Date(datetime);
        const pad = (n) => n.toString().padStart(2, '0');
      
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };
      
      const formatDateTimeForUpdate = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convertir los valores de fecha a formato timestamp para la BD
            const formattedPromotion = {
                ...promotion,
                dateTimeStart: promotion.dateTimeStart
                ? promotionToEdit
                    ? formatDateTimeForUpdate(promotion.dateTimeStart)
                    : formatDateTimeForCreate(promotion.dateTimeStart)
                : null,
                dateTimeEnd: promotion.dateTimeEnd
                ? promotionToEdit
                    ? formatDateTimeForUpdate(promotion.dateTimeEnd)
                    : formatDateTimeForCreate(promotion.dateTimeEnd)
                : null
            };
            
            if (promotionToEdit) {
                await onUpdatePromotion(promotionToEdit.idPromotion, formattedPromotion);
            } else {
                await onAddPromotion(formattedPromotion);
            }
            onClose();
        } catch (error) {
            alert(`Se ha producido un error: ${error.message}`);        
        }
    };
      
    return (
        <Modal show={isOpen} onClose={onClose} size="xl">
            <ModalHeader><p className='poppins-bold text-2xl'>{promotionToEdit ? 'Editar Promoción' : 'Agregar Promoción'}</p></ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <TextInput
                            id="name"
                            name="name"
                            value={promotion.name}
                            onChange={handleInputChange}
                            placeholder="Ingrese el nombre de la promoción."
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                            Descuento (%)
                        </label>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                            <TextInput
                                id="discount"
                                name="discount"
                                type="text" 
                                value={promotion.discount}
                                onChange={handleInputChange}
                                placeholder="Ingrese el descuento"
                                required
                                className="flex-1"
                            />
                            </div>
                        </div>
                    </div>
                    
                    {/* Input unificado para fecha y hora de inicio */}
                    <div className="mb-6">
                        <label htmlFor="dateTimeStart" className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha y Hora de Inicio
                        </label>
                        <input
                            type="datetime-local"
                            id="dateTimeStart"
                            name="dateTimeStart"
                            value={promotion.dateTimeStart}
                            onChange={handleInputChange}
                            className="block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                            required
                        />
                    </div>

                    {/* Input unificado para fecha y hora de fin */}
                    <div className="mb-6">
                        <label htmlFor="dateTimeEnd" className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha y Hora de Fin
                        </label>
                        <input
                            type="datetime-local"
                            id="dateTimeEnd"
                            name="dateTimeEnd"
                            value={promotion.dateTimeEnd}
                            onChange={handleInputChange}
                            className="block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                            required
                        />
                    </div>

                    <ModalFooter className='flex items-center justify-end'>
                        <Button color="gray" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button color="blue" type="submit" className=''>
                            {promotionToEdit ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default PromotionModal;