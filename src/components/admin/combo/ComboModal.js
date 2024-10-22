import { Modal, ModalHeader, ModalBody, ModalFooter, Button, TextInput } from 'flowbite-react';
import { useState, useEffect, useMemo } from 'react';

const ComboModal = ({ isOpen, onClose, onAddCombo, comboToEdit, products = [] }) => {
    const [combo, setCombo] = useState({
        name: '',
        description: '',
        price: '',
        productCombo: [],
    });
    
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (comboToEdit) {
            setCombo({
                name: comboToEdit.name,
                description: comboToEdit.description,
                price: comboToEdit.price,
                productCombo: comboToEdit.productCombo || []
            });
        } else {
            setCombo({ idCombo: '', name: '', description: '', price: '', productCombo: [] });
            setFile(null);
        }
    }, [comboToEdit]);

    useEffect(() => {
        if (!isOpen) {
            setFile(null);
        }
    }, [isOpen]);

    const filteredOptions = useMemo(() => 
        products.filter(option => 
            option.name.toLowerCase().includes(query.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name)), 
        [query, products]
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCombo(prevCombo => ({
            ...prevCombo,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmitCombo = async (e) => {
        e.preventDefault();
        try {
            const comboJson = {
                name: combo.name,
                description: combo.description,
                price: combo.price,
                productCombo: combo.productCombo
            };
            await onAddCombo(comboJson, file);
            onClose();
        } catch (error) {
            console.error('Error al agregar/actualizar combo:', error);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <ModalHeader>
                <p className='poppins-bold text-2xl'>{comboToEdit ? 'Editar Combo' : 'Agregar Combo'}</p>
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmitCombo}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <TextInput
                            id="name"
                            name="name"
                            value={combo.name}
                            onChange={handleInputChange}
                            placeholder="Ingrese el nombre del combo."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <TextInput
                            id="description"
                            name="description"
                            value={combo.description}
                            onChange={handleInputChange}
                            placeholder="Ingrese la descripción del combo."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                        <TextInput
                            id="price"
                            name="price"
                            type="number"
                            value={combo.price}
                            onChange={handleInputChange}
                            placeholder="Ingrese el precio del combo."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">Imagen</label>
                        {(file || combo.img) && (
                            <div className="mb-4">
                                <img 
                                    src={file ? URL.createObjectURL(file) : `${process.env.REACT_APP_IMAGES_URL}${combo.img}`} 
                                    alt="Vista previa del combo" 
                                    className="w-20 h-20 object-cover" 
                                />
                            </div>
                        )}
                        <input
                            id="file"
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange}
                        />
                    </div>
                    <ModalFooter className='flex items-center justify-end'>
                        <Button color="gray" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button color="blue" type="submit">
                            {comboToEdit ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default ComboModal;
