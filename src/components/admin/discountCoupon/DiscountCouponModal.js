import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

const DiscountCouponModal = ({isOpen, onClose, onAddDiscountCoupon, onUpdateDiscountCoupon, discountCouponToEdit}) => {

    const [discountCoupon, setDiscountCoupon] = useState({
        descuento: 0,
        vigente: true // Por defecto los nuevos cupones serán vigentes
    });

    const isEditMode = !!discountCouponToEdit;

    useEffect(() => {
        if (discountCouponToEdit) {
            setDiscountCoupon({
                code: discountCouponToEdit.code,
                current: discountCouponToEdit.current
            });
        } else {
            setDiscountCoupon({ 
                code: 0,
                current: true // Por defecto los nuevos cupones serán vigentes
            });
        }
    }, [discountCouponToEdit]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setDiscountCoupon(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (name === 'descuento') {
            // Solo permitir entrada numérica para descuento
            const numericValue = value.replace(/[^0-9.]/g, '');
            
            // Asegurar que el valor esté dentro del rango válido (0-100)
            let parsedValue = parseFloat(numericValue);
            if (isNaN(parsedValue)) parsedValue = 0;
            if (parsedValue > 100) parsedValue = 100;
            
            setDiscountCoupon(prev => ({
                ...prev,
                discount: parsedValue
            }));
        } else {
            setDiscountCoupon(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await onUpdateDiscountCoupon(discountCouponToEdit.idDiscountCoupon, discountCoupon);
            } else {
                // Para nuevos cupones, siempre serán vigentes
                await onAddDiscountCoupon({
                    ...discountCoupon,
                    current: true
                });
            }
            onClose();
        } catch (error) {
            alert(`Se ha producido un error: ${error.message}`);        
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <ModalHeader>
                <p className='poppins-bold text-2xl'>
                    {isEditMode ? 'Editar Cupón de Descuento' : 'Agregar Cupón de Descuento'}
                </p>
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="descuento" className="block text-sm font-medium text-gray-700">
                            Descuento (%)
                        </label>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                            <TextInput
                                id="discount"
                                name="discount"
                                type="text" 
                                value={discountCoupon.discount}
                                onChange={handleInputChange}
                                placeholder="Ingrese el descuento"
                                required
                                className="flex-1"
                            />
                            </div>
                        </div>
                    </div>
                    
                    {/* Mostrar el toggle de vigencia solo en modo edición */}
                    {isEditMode && (
                        <div className="mb-4">
                            <label htmlFor="vigente" className="block text-sm font-medium text-gray-700 mb-2">¿Está vigente?</label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                type="checkbox"
                                id="current"
                                name="current"
                                checked={discountCoupon.current}
                                onChange={handleInputChange}
                                className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500">
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-900">
                                {discountCoupon.current ? 'Sí' : 'No'}
                                </span>
                            </label>
                        </div>
                    )}
                    
                    <ModalFooter className='flex items-center justify-end'>
                        <Button color="gray" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button color="blue" type="submit">
                            {isEditMode ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default DiscountCouponModal;