import { Modal, ModalHeader, ModalBody, Button, Select } from 'flowbite-react';
import { useState } from 'react';

const ProductComboModal = ({ products, onAddProductCombo, idCombo, onClose }) => {
    const [productCombos, setProductCombos] = useState([{ idProduct: "", quantity: 1 }]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProductCombos = productCombos.map(item => ({
            quantity: parseInt(item.quantity, 10),
            idProduct: { idProduct: parseInt(item.idProduct, 10) },
            idCombo: { idCombo }
        }));
        console.log(newProductCombos);
        newProductCombos.forEach(productCombo => onAddProductCombo(productCombo));
        onClose();
    };

    const handleAddProductCombo = () => {
        setProductCombos([...productCombos, { idProduct: "", quantity: 1 }]);
    };

    const handleProductChange = (index, value) => {
        const updatedCombos = [...productCombos];
        updatedCombos[index].idProduct = value;
        setProductCombos(updatedCombos);
    };

    const handleQuantityChange = (index, value) => {
        const updatedCombos = [...productCombos];
        updatedCombos[index].quantity = value;
        setProductCombos(updatedCombos);
    };

    return (
        <Modal show={true} onClose={onClose}>
            <ModalHeader>Agregar Product Combo</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    {productCombos.map((combo, index) => (
                        <div key={index} className="mb-4">
                            <label htmlFor={`product-${index}`} className="block text-sm font-medium text-gray-700">
                                Seleccionar Producto
                            </label>
                            <Select
                                id={`product-${index}`}
                                required
                                value={combo.idProduct}
                                onChange={(e) => handleProductChange(index, e.target.value)}
                            >
                                <option value="">Selecciona un producto</option>
                                {products.map((product) => (
                                    <option key={product.idProduct} value={product.idProduct}>
                                        {product.name}
                                    </option>
                                ))}
                            </Select>
                            <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700 mt-2">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                id={`quantity-${index}`}
                                min="1"
                                value={combo.quantity}
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                required
                            />
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
}
export default ProductComboModal;
