import { useState } from "react";
import { FaEdit, FaSort } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import Swal from "sweetalert2";

const PromotionList = ({promotions,deletePromotion, onEditPromotion}) => {
    const [sortConfig, setSortConfig] = useState({key:null, direction:'ASC'});

    const handleSort = (columnKey) => {
        let direction = 'ASC';
        if (sortConfig.key === columnKey && sortConfig.direction === 'ASC') {
            direction = 'DESC';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const sortedPromotions = [...promotions].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ASC' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ASC' ? 1 : -1;
        }
        return 0;
    })

    const handleClickDelete = (id) => {
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
                deletePromotion(id); 
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'La promoción ha sido eliminada.',
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
                        <th className="px-4 py-2 border-b text-zinc-800 border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Codigo
                                <button onClick={() => handleSort('idCategory')} className="ml-2 ">
                                    <FaSort className="text-zinc-700" />
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Nombre
                                <button onClick={() => handleSort('name')} className="ml-2 ">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Descuento
                                <button onClick={() => handleSort('description')} className="ml-2 ">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Fecha Inicio
                                <button onClick={() => handleSort('description')} className="ml-2 ">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Fecha Fin
                                <button onClick={() => handleSort('description')} className="ml-2 ">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPromotions.map((promotion, index) => (
                        <tr 
                            key={promotion.idPromotion} 
                            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}  
                        >
                            <td className="px-4 py-2 border-b border-b-gray-300">{promotion.idPromotion}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">{promotion.name}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">{promotion.discount}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">{promotion.dateTimeStart}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">{promotion.dateTimeEnd}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">
                                <div className="flex items-center">
                                    <button 
                                        className="text-green-600 text-2xl hover:text-green-500" 
                                        onClick={()=>onEditPromotion(promotion)}
                                    >
                                        <FaEdit/>
                                    </button>
                                    <button 
                                        className="text-red-600 text-3xl hover:text-red-500" 
                                        onClick={()=>handleClickDelete(promotion.idPromotion)}
                                    > 
                                        <TiDelete/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PromotionList;

