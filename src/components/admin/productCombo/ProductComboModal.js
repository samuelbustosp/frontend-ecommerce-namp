import { Modal, ModalHeader, ModalBody, Button, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { TiDelete, TiPlus } from "react-icons/ti";

const ProductComboModal = ({
    products,
    onAddProductCombo,
    onUpdateProductCombo,
    idCombo,
    onClose,
    productCombos,
    onDeleteProductCombo
}) => {
    const [productCombo, setProductCombo] = useState([{ idProduct: "", quantity: 1, isNew: true }]);

    useEffect(() => {
        if (productCombos && Array.isArray(productCombos.productCombo)) {
            const loaded = productCombos.productCombo.map(item => ({
                idProductCombo: item.idProductCombo,
                idProduct: item.idProduct?.idProduct || item.idProduct || "",
                quantity: item.quantity || 1,
                isNew: false
            }));
            setProductCombo(loaded);
        } else {
            setProductCombo([{ idProduct: "", quantity: 1, isNew: true }]);
        }
    }, [productCombos]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const combosToAdd = productCombo.filter(pc => pc.isNew);
            const combosToUpdate = productCombo.filter(pc => !pc.isNew);
    
            const formattedAdd = combosToAdd.map(item => ({
                quantity: parseInt(item.quantity, 10),
                idProduct: { idProduct: parseInt(item.idProduct, 10) },
                idCombo: { idCombo }
            }));
    
            // Este formateo ahora también incluye el idProductCombo necesario
            const formattedUpdate = combosToUpdate.map(item => ({
                idProductCombo: item.idProductCombo,
                quantity: parseInt(item.quantity, 10),
                idProduct: { idProduct: parseInt(item.idProduct, 10) },
                idCombo: { idCombo }
            }));
    
            if (formattedAdd.length > 0) {
                for (const item of formattedAdd) {
                  await onAddProductCombo(item); // en vez de pasarle el array entero
                }
            }
    
            for (const item of formattedUpdate) {
                try {
                    await onUpdateProductCombo(item.idProductCombo, {
                        quantity: item.quantity,
                        idProduct: item.idProduct,
                        idCombo: item.idCombo
                    });
                } catch (err) {
                    console.error("Fallo update con ID", item.idProductCombo, err);
                }
            }            
    
            onClose();
        } catch (error) {
            alert(`Se ha producido un error: ${error.message}`);
        }
    };
    

    const handleAddProductCombo = () => {
        setProductCombo([...productCombo, { idProduct: "", quantity: 1, isNew: true }]);
    };

    const handleProductChange = (index, value) => {
        const updatedCombo = [...productCombo];
        updatedCombo[index] = {
            ...updatedCombo[index],
            idProduct: parseInt(value, 10)
        };
        setProductCombo(updatedCombo);
    };

    const handleQuantityChange = (index, value) => {
        const updatedCombo = [...productCombo];
        updatedCombo[index] = {
            ...updatedCombo[index],
            quantity: value
        };
        setProductCombo(updatedCombo);
    };

    const handleDeleteProductCombo = async (index) => {
        const item = productCombo[index];
    
        if (!item.isNew && item.idProductCombo) {
            // Si ya fue guardado en backend
            const confirmDelete = window.confirm("¿Seguro que querés eliminar este producto del combo?");
            if (!confirmDelete) return;
    
            try {
                await onDeleteProductCombo(item.idProductCombo);
            } catch (error) {
                alert("Error al eliminar el producto del combo: " + error.message);
                return;
            }
        }
    
        // Remover del estado local (si es nuevo o si se borró en backend)
        const updatedCombo = productCombo.filter((_, i) => i !== index);
        setProductCombo(updatedCombo);
    };

    return (
        <Modal show={true} onClose={onClose}>
            <ModalHeader className='poppins-bold'>Productos del combo</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    {productCombo.map((combo, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                                <div className="w-2/5">
                                    <label htmlFor={`product-${index}`} className="block text-sm poppins-semibold text-gray-700 mb-2">
                                        Seleccionar Producto
                                    </label>
                                    <Select
                                        id={`product-${index}`}
                                        required
                                        value={combo.idProduct}
                                        onChange={(e) => handleProductChange(index, e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="" className='poppins-light'>Selecciona un producto</option>
                                        {products.map((product) => (
                                            <option key={product.idProduct} value={product.idProduct} className='poppins-light'>
                                                {product.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="w-1/5 px-4">
                                    <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 mb-2 poppins-semibold">
                                        Cantidad
                                    </label>
                                    <input
                                        type="number"
                                        id={`quantity-${index}`}
                                        min="1"
                                        value={combo.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        required
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md poppins-light"
                                    />
                                </div>
                                <div className="w-1/5 flex flex-col justify-center items-center">
                                    <p className='poppins-semibold text-gray-700 text-sm mb-2'>Eliminar</p>
                                    <button
                                        type="button"
                                        className="text-gray-800/50 hover:text-red-500 rounded-full text-4xl transition duration-200"
                                        onClick={() => handleDeleteProductCombo(index)}
                                    >
                                        <TiDelete />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}

                    
                    <button onClick={handleAddProductCombo} className="rounded-full bg-blue-800 p-2 my-2 flex items-center gap-2 hover:bg-blue-700">
                        <span className='text-white text-xl'>
                            <TiPlus/> 
                        </span>
                        <span className='poppins-semibold text-white'>
                            Agregar producto
                        </span>
                    </button>

                    <div className="flex justify-end mt-4 poppins-semibold text-white">
                        <button type="submit" className='rounded-full bg-blue-800 py-2 px-3 hover:bg-blue-700'>Guardar</button>
                        <button type="button" onClick={onClose} className="ml-2 rounded-lg bg-gray-800 hover:bg-gray-700 py-2 px-3">
                            Cancelar
                        </button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default ProductComboModal;
