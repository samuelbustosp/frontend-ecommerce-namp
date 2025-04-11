import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

const PromotionModal = ({isOpen, onClose, onAddPromotion, onUpdatePromotion, promotionToEdit}) => {
    const [promotion, setPromotion] = useState({
        name: '',
        discount: 0,
        dateTimeStart: '',
        dateTimeEnd: ''
    });
    
    // Estados separados para fecha y hora
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        if (promotionToEdit) {
            setPromotion({
                name: promotionToEdit.name,
                discount: promotionToEdit.discount,
                dateTimeStart: promotionToEdit.dateTimeStart,
                dateTimeEnd: promotionToEdit.dateTimeEnd
            });
            
            // Extraer fecha y hora de los timestamps existentes
            if (promotionToEdit.dateTimeStart) {
                const startDateTime = new Date(promotionToEdit.dateTimeStart);
                setStartDate(startDateTime.toISOString().split('T')[0]);
                setStartTime(startDateTime.toTimeString().slice(0, 5));
            }
            
            if (promotionToEdit.dateTimeEnd) {
                const endDateTime = new Date(promotionToEdit.dateTimeEnd);
                setEndDate(endDateTime.toISOString().split('T')[0]);
                setEndTime(endDateTime.toTimeString().slice(0, 5));
            }
        } else {
            setPromotion({ 
                name: '', 
                discount: 0, 
                dateTimeStart: '', 
                dateTimeEnd: ''
            });
            setStartDate('');
            setStartTime('');
            setEndDate('');
            setEndTime('');
        }
    }, [promotionToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'discount') {
          // Only allow numeric input for discount
          const numericValue = value.replace(/[^0-9.]/g, '');
          
          // Ensure value is within valid range (0-100)
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
    
    // Manejar cambios en los campos de fecha y hora
    const handleDateTimeChange = (e) => {
        const { name, value } = e.target;
        
        switch(name) {
            case 'startDate':
                setStartDate(value);
                if (value && startTime) {
                    const newDateTime = `${value}T${startTime}`;
                    setPromotion(prev => ({...prev, dateTimeStart: newDateTime}));
                }
                break;
                
            case 'startTime':
                setStartTime(value);
                if (startDate && value) {
                    const newDateTime = `${startDate}T${value}`;
                    setPromotion(prev => ({...prev, dateTimeStart: newDateTime}));
                }
                break;
                
            case 'endDate':
                setEndDate(value);
                if (value && endTime) {
                    const newDateTime = `${value}T${endTime}`;
                    setPromotion(prev => ({...prev, dateTimeEnd: newDateTime}));
                }
                break;
                
            case 'endTime':
                setEndTime(value);
                if (endDate && value) {
                    const newDateTime = `${endDate}T${value}`;
                    setPromotion(prev => ({...prev, dateTimeEnd: newDateTime}));
                }
                break;
                
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Asegurarse de que los timestamps estén en el formato correcto
            const formattedPromotion = {
                ...promotion,
                dateTimeStart: startDate && startTime ? `${startDate}T${startTime}:00` : '',
                dateTimeEnd: endDate && endTime ? `${endDate}T${endTime}:00` : ''
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
                    
                    {/* Campos separados para fecha y hora de inicio con mayor tamaño */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Fecha y Hora de Inicio</label>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex-1">
                                <label htmlFor="startDate" className="block text-sm text-gray-500 mb-2">Fecha</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={startDate}
                                    onChange={handleDateTimeChange}
                                    className="block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="startTime" className="block text-sm text-gray-500 mb-2">Hora</label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={startTime}
                                    onChange={handleDateTimeChange}
                                    className="block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Campos separados para fecha y hora de fin con mayor tamaño */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Fecha y Hora de Fin</label>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex-1">
                                <label htmlFor="endDate" className="block text-sm text-gray-500 mb-2">Fecha</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={endDate}
                                    onChange={handleDateTimeChange}
                                    className="block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="endTime" className="block text-sm text-gray-500 mb-2">Hora</label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={endTime}
                                    onChange={handleDateTimeChange}
                                    className="block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                    required
                                />
                            </div>
                        </div>
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