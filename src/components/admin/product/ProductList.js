import { TiDelete } from "react-icons/ti";
import { FaEdit, FaSort } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useState } from "react";
import PropTypes from 'prop-types';



const ProductList = ({products, deleteProduct, onEditProduct}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ASC' });

    const handleSort = (columnKey) => {
        let direction = 'ASC';
        if (sortConfig.key === columnKey && sortConfig.direction === 'ASC') {
            direction = 'DESC';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ASC' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ASC' ? 1 : -1;
        }
        return 0;
    });

    const handleClickDelete = (idProduct) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct(idProduct);  
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'El producto ha sido eliminado.',
                    icon: 'success',
                    confirmButtonColor: '#057a55',
                });
            }
        });
    }
    
    return (  
        <div className="overflow-x-auto p-4">
            <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-md">
                <thead className="bg-white rounded-xl text-left shadow">
                    <tr>
                        <th className="px-4 py-2 border-b text-zinc-800 border-b-gray-300 poppins-semibold">Imagen</th>
                        <th className="px-4 py-2 border-b text-zinc-800 border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Codigo
                                <button onClick={() => handleSort('idProduct')} className="ml-2">
                                    <FaSort className="text-zinc-700" />
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Nombre
                                <button onClick={() => handleSort('name')} className="ml-2">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Descripción
                                <button onClick={() => handleSort('description')} className="ml-2">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Subcategoría
                                <button onClick={() => handleSort('idSubcategory')} className="ml-2">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>

                        {/* NUEVA COLUMNA: Precio */}
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Precio
                            </div>
                        </th>

                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Promoción
                                <button onClick={() => handleSort('idPromotion')} className="ml-2">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">Acción</th>
                    </tr>
                </thead>
                <tbody className="poppins-regular">
                    {sortedProducts.map((product, index) => {
                        const hasPromotion = product.idPromotion != null;
                        const price = product.price;
                        const sellingPrice = hasPromotion 
                            ? (price - (price * product.idPromotion.discount / 100)).toFixed(2) 
                            : price.toFixed(2);

                        return (
                            <tr key={product.idProduct} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                <td className="px-4 py-2 border-b border-b-gray-300">
                                    <img src={`${process.env.REACT_APP_IMAGES_URL}${product.img}`} 
                                        alt={product.name} 
                                        className="w-12 h-12 object-cover" 
                                    />
                                </td>
                                <td className="px-4 py-2 border-b border-b-gray-300">{product.idProduct}</td>
                                <td className="px-4 py-2 border-b border-b-gray-300">{product.name}</td>
                                <td className="px-4 py-2 border-b border-b-gray-300">{product.description}</td>
                                <td className="px-4 py-2 border-b border-b-gray-300">{product.idSubcategory.name}</td>

                                {/* Celda nueva: precio con o sin promoción */}
                                <td className="px-4 py-2 border-b border-b-gray-300">
                                    {hasPromotion ? (
                                        <div className="flex flex-col">
                                            <span className="text-sm line-through">${price.toFixed(2)}</span>
                                            <span className="text-red-500 dark:text-white">
                                                ${sellingPrice}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="dark:text-white">${price.toFixed(2)}</span>
                                    )}
                                </td>

                                <td className="px-4 py-2 border-b border-b-gray-300">
                                    {hasPromotion ? (
                                        <div>
                                            <div className="font-medium">{product.idPromotion.name}</div>
                                            <div className="text-green-600">{product.idPromotion.discount}% descuento</div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">Sin promoción</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b border-b-gray-300">
                                    <div className="flex items-center">
                                        <button 
                                            className="text-green-600 text-2xl hover:text-green-500" 
                                            onClick={() => onEditProduct(product)}
                                        >
                                            <FaEdit/>
                                        </button>
                                        <button 
                                            className="text-red-600 text-3xl hover:text-red-500" 
                                            onClick={() => handleClickDelete(product.idProduct)}
                                        > 
                                            <TiDelete/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

ProductList.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            idProduct: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            img: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            idSubcategory: PropTypes.shape({
                name: PropTypes.string.isRequired
            }).isRequired,
            idPromotion: PropTypes.shape({
                name: PropTypes.string,
                discount: PropTypes.number
            })
        })
    ).isRequired,
    deleteProduct: PropTypes.func,
    onEditProduct: PropTypes.func
};

export default ProductList;