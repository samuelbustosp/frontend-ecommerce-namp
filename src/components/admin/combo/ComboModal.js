import { Modal, ModalHeader, ModalBody, ModalFooter, Button, TextInput, Select } from 'flowbite-react';
import { useState, useEffect, useMemo } from 'react';

const ComboModal = ({ isOpen, onClose, onAddCombo, onUpdateCombo, comboToEdit, products = [] }) => {
    const [combo, setCombo] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        productCombo: [] // Lista para productos y cantidades
    });

    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (comboToEdit) {
            setCombo({
                name: comboToEdit.name,
                description: comboToEdit.description,
                price: comboToEdit.price,
                stock: comboToEdit.stock,
                productCombo: comboToEdit.productCombo || [] // Asignar productos del combo a editar
            });
        } else {
            setCombo({ name: '', description: '', price: '', stock: '', productCombo: [] });
            setFile(null);
        }
    }, [comboToEdit, products]);

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

    const handleProductSelect = (productId) => {
        const productExists = combo.productCombo.find(item => item.idProduct === productId);
        if (!productExists) {
            setCombo(prevCombo => ({
                ...prevCombo,
                productCombo: [...prevCombo.productCombo, { idProduct: productId, quantity: 1 }] // Añadir nuevo producto con cantidad inicial 1
            }));
        }
    };

    const handleQuantityChange = (productId, quantity) => {
        setCombo(prevCombo => ({
            ...prevCombo,
            productCombo: prevCombo.productCombo.map(item => 
                item.idProduct === productId ? { ...item, quantity: Number(quantity) } : item
            )
        }));
    };

    const handleAddProduct = () => {
        if (combo.productCombo.length < 5) { // Limitar a un máximo de 5 productos, puedes cambiarlo según tu necesidad
            setCombo(prevCombo => ({
                ...prevCombo,
                productCombo: [...prevCombo.productCombo, { idProduct: null, quantity: 1 }] // Añadir nuevo producto vacío
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const comboJson = {
                name: combo.name,
                description: combo.description,
                price: combo.price,
                stock: combo.stock,
                productCombo: combo.productCombo // Incluir lista de productos y cantidades
            };

            if (comboToEdit) {
                await onUpdateCombo(comboToEdit.idCombo, comboJson, file);
            } else {
                await onAddCombo(comboJson, file);
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
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                        <TextInput
                            id="stock"
                            name="stock"
                            type="number"
                            value={combo.stock}
                            onChange={handleInputChange}
                            placeholder="Ingrese el stock del combo."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700">Seleccionar Productos</label>
                        {combo.productCombo.map((item, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <Select
                                    onChange={(e) => handleProductSelect(e.target.value)}
                                    className="mr-2"
                                    value={item.idProduct || ''}
                                >
                                    <option disabled value="">Seleccionar producto</option>
                                    {filteredOptions.map(product => (
                                        <option key={product.idProduct} value={product.idProduct}>
                                            {product.name}
                                        </option>
                                    ))}
                                </Select>
                                <TextInput
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.idProduct, e.target.value)}
                                    placeholder="Cantidad"
                                    className="w-20"
                                    required
                                />
                            </div>
                        ))}
                        <Button onClick={handleAddProduct} className="rounded-full p-2">+</Button>
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
