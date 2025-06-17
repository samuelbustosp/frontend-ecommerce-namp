import { Modal, ModalHeader, ModalBody, ModalFooter, Button, TextInput, Select } from 'flowbite-react';
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';

const ProductModal = ({ isOpen, onClose, onAddProduct, onUpdateProduct, productToEdit, subcategories = [], promotions = [] }) => {
    const [product, setProduct] = useState({ name: '', description: '', img:'', stock: '', price: '', idSubcategory: null, idPromotion:null});
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setProduct({
                name: productToEdit.name,
                description: productToEdit.description,
                img: productToEdit.img,
                stock: productToEdit.stock,
                price: productToEdit.price,
                idSubcategory: productToEdit.idSubcategory.idSubcategory,
                idPromotion: productToEdit.idPromotion?.idPromotion || null
            });
        } else {
            setProduct({ name: '', description: '', img:'', stock: '', price: '', idSubcategory: null, idPromotion:null});
            setFile(null);
        }
    }, [productToEdit, subcategories]);

    // Efecto para restablecer el estado del archivo cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setFile(null);
        }
    }, [isOpen]);

    const filteredOptions = useMemo(() => 
        subcategories
            .filter(option => 
                option.name.toLowerCase().includes(query.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name)), 
        [query, subcategories]
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };
    
    const handleSubcategoryChange = (e) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            idSubcategory: e.target.value
        }));
    };
    
    const handlePromotionChange = (e) => {
        setProduct(prev => ({ ...prev, idPromotion: e.target.value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productJson = ({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                idSubcategory: {
                    idSubcategory: Number(product.idSubcategory) 
                },
                idPromotion: product.idPromotion ? { idPromotion: Number(product.idPromotion) } : null

            });
            
            if (productToEdit){
                await onUpdateProduct(productToEdit.idProduct, productJson, file)
            } else {
                await onAddProduct(productJson, file)
            }
            onClose();
        } catch (error) {
            alert(`Se ha producido un error: ${error.message}`);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <ModalHeader>
                <p className='poppins-bold text-2xl'>{productToEdit ? 'Editar Producto' : 'Agregar Producto'}</p>
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <TextInput
                            id="name"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            placeholder="Ingrese el nombre del producto."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <TextInput
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleInputChange}
                            placeholder="Ingrese la descripción del producto."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                        <TextInput
                            id="price"
                            name="price"
                            type="number"
                            value={product.price}
                            onChange={handleInputChange}
                            placeholder="Ingrese el precio del producto."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                        <TextInput
                            id="stock"
                            name="stock"
                            type="number"
                            value={product.stock}
                            onChange={handleInputChange}
                            placeholder="Ingrese el stock del producto."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700">Subcategoría</label>
                        <Select
                            id="dropdown"
                            value={product.idSubcategory || ''}
                            onChange={handleSubcategoryChange}
                        >
                            <option disabled value="">Seleccionar subcategoría</option>
                            {filteredOptions.map((subcat) => (
                                <option key={subcat.idSubcategory} value={subcat.idSubcategory}>
                                    {subcat.name}
                                </option>
                            ))}
                        </Select>
                    </div>


                    {/* Promoción */}
                    <div className="mb-4">
                    <label htmlFor="promotion" className="block text-sm font-medium text-gray-700">Promocion</label>
                        <Select
                            id="promotion"
                            value={product.idPromotion || ''} 
                            onChange={handlePromotionChange}
                        >
                            <option disabled value="">Seleccionar promoción</option>
                            {promotions.sort((a, b) => a.name.localeCompare(b.name)).map(promo => (
                                <option key={promo.idPromotion} value={promo.idPromotion}>{promo.name}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">Imagen</label>
                        {(file || product.img) && (
                            <div className="mb-4">
                                <img 
                                    src={file ? URL.createObjectURL(file) : `${process.env.REACT_APP_IMAGES_URL}${product.img}`} 
                                    alt="Vista previa del producto" 
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
                            {productToEdit ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
};

// Validación de props
ProductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddProduct: PropTypes.func,
    onUpdateProduct: PropTypes.func,
    productToEdit: PropTypes.object,
    subcategories: PropTypes.arrayOf(
        PropTypes.shape({
            idSubcategory: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        })
    )
};

export default ProductModal;
