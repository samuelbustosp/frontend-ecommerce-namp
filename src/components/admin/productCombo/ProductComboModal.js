import { Modal, ModalHeader, ModalBody, Button, Select } from 'flowbite-react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { TiDelete } from "react-icons/ti";

const ProductComboModal = ({ products, onAddProductCombo, onUpdateProductCombo, productComboToEdit, idCombo,combos, onClose, productCombos }) => {
    // Estado inicial como un array vacío
    const [productCombo, setProductCombo] = useState([{ idProduct: "", quantity: 1 }]);

    useEffect(() => {
        if (productCombos.length > 0) {
            setProductCombo(productCombos.map(item => ({
                idProduct: item.idProduct ? item.idProduct.idProduct : "", // Acceder al idProduct del objeto
                quantity: item.quantity || 1,
            })));
        }
        console.log(productCombos)
    }, [productCombos]);

    useEffect(() => {
        if (productComboToEdit) {
            // Si estás editando, asegura que sea un array válido
            setProductCombo(
                Array.isArray(productComboToEdit)
                    ? productComboToEdit.map(item => ({
                        idProduct: item.idProduct || "",
                        quantity: item.quantity || 1,
                    }))
                    : [{ idProduct: productComboToEdit.idProduct || "", quantity: productComboToEdit.quantity || 1 }]
            );
        } else {
            setProductCombo([{ idProduct: "", quantity: 1 }]);
        }
    }, [productComboToEdit]);

    useEffect(() => {
        if (onClose) {  // Si el modal está cerrado
            setProductCombo([{ idProduct: "", quantity: 1 }]);  // Restablecer el estado a su valor inicial
        }
    }, [onClose]); 

   const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newProductCombo = productCombo.map(item => ({
                quantity: parseInt(item.quantity, 10),
                idProduct: {idProduct: parseInt(item.idProduct, 10)},
                idCombo: {idCombo: idCombo},
            }));
        
            console.log("data enviada", newProductCombo);
            
            console.log("data enviada", newProductCombo);

            if (productComboToEdit) {
                await onUpdateProductCombo(productComboToEdit.idCombo, newProductCombo); // Asegúrate de enviar el ID del combo y los datos actualizados
            } else {
                await onAddProductCombo(newProductCombo);
            }

            // Actualiza el estado local con los nuevos datos después de la actualización
            setProductCombo(newProductCombo);
            onClose();
        } catch (error) {
            alert(`Se ha producido un error: ${error.message}`);
        }
};


    const handleAddProductCombo = () => {
        setProductCombo([...productCombo, { idProduct: "", quantity: 1 }]);
    };

    const handleProductChange = (index, value) => {
        const updatedCombo = [...productCombo];
        updatedCombo[index].idProduct = parseInt(value, 10); // Usar el idProduct directamente
        setProductCombo(updatedCombo);
    };    

    const handleQuantityChange = (index, value) => {
        const updatedCombo = [...productCombo];
        updatedCombo[index].quantity = value;
        setProductCombo(updatedCombo);
    };

    const handleDeleteProductCombo = (index) => {
        const updatedCombo = productCombo.filter((_, i) => i !== index); // Excluir el producto con el índice especificado
        setProductCombo(updatedCombo);
    };
    

    return (
        <Modal show={true} onClose={onClose}>
            <ModalHeader>Productos del combo</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    {productCombo.map((combo, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                                <div className="w-2/5">
                                    <label htmlFor={`product-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                                        Seleccionar Producto
                                    </label>
                                    <Select
                                        id={`product-${index}`}
                                        required
                                        value={combo.idProduct} // Debería ser el idProduct del producto
                                        onChange={(e) => handleProductChange(index, e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="">Selecciona un producto</option>
                                        {products.map((product) => (
                                            <option key={product.idProduct} value={product.idProduct}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="w-1/5 px-4">
                                    <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                                        Cantidad
                                    </label>
                                    <input
                                        type="number"
                                        id={`quantity-${index}`}
                                        min="1"
                                        value={combo.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        required
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="w-1/5">
                                    <button
                                        type="button"
                                        className=" text-red-500 hover:text-red-600 rounded-full p-2 text-3xl transition duration-200"
                                        onClick={() => handleDeleteProductCombo(index)}
                                    >
                                        <TiDelete />
                                    </button>
                                </div>
                            </div>
                        </div>
                    
                    
                    ))}
                    <Button onClick={handleAddProductCombo} className="rounded-full p-2">
                        +
                    </Button>
                    <div className="flex justify-end mt-4">
                        <Button type="submit">Agregar</Button>
                        <Button type="button" onClick={onClose} className="ml-2">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};



export default ProductComboModal;
