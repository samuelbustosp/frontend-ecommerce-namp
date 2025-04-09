import { Modal, ModalHeader, ModalBody, ModalFooter, Button, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComboModal = ({ isOpen, onClose, onAddCombo, comboToEdit, onUpdateCombo}) => {
    const [combo, setCombo] = useState({
        name: '',
        description: '',
        price: '',
        productCombo: '',
    });
    
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (comboToEdit) {
            setCombo({
                name: comboToEdit.name,
                description: comboToEdit.description,
                price: comboToEdit.price,
                productCombo: comboToEdit.productCombo,
                img: comboToEdit.img || ""
            });
        } else {
            setCombo({ idCombo: '', name: '', description: '', price: '', productCombo: '', img:''});
            setFile(null);
        }
    }, [comboToEdit]);

    useEffect(() => {
        if (!isOpen) {
            setFile(null);
        }
    }, [isOpen]);

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
            };

            console.log('data enviada', comboJson)
            if (comboToEdit){
                await onUpdateCombo(comboToEdit.idCombo,comboJson, file)
            } else {
                await onAddCombo(comboJson, file)
            }
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

ComboModal.propTypes = {
    // Propiedad que indica si el modal está abierto o cerrado
    isOpen: PropTypes.bool.isRequired,

    // Función que se llama cuando el modal se cierra
    onClose: PropTypes.func.isRequired,

    // Función que se llama para agregar o actualizar un combo
    onAddCombo: PropTypes.func.isRequired,

    // Objeto con los datos del combo a editar, puede ser null si no se está editando un combo
    comboToEdit: PropTypes.shape({
        idCombo: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.string,
        productCombo: PropTypes.arrayOf(PropTypes.object),
        img: PropTypes.string, // Esto debería ser opcional, ya que es solo cuando se edita un combo
    }),
};

ComboModal.defaultProps = {
    comboToEdit: null, // Por defecto es null si no se pasa un combo para editar
};
export default ComboModal;
