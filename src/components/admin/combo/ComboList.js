import { FaEdit, FaSort,FaPlusCircle,FaTimesCircle  } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useState } from "react";
import ProductComboContainer from "../../../containers/admin/productCombo/ProductComboContainer";
import PropTypes from 'prop-types';



const ComboList = ({combos,deleteCombo,onEditCombo}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ASC' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idCombo, setIdCombo] = useState(null);

    console.log(idCombo)


    const handleSort = (columnKey) => {
        let direction = 'ASC';
        if (sortConfig.key === columnKey && sortConfig.direction === 'ASC') {
            direction = 'DESC';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const sortedCombos = [...combos].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ASC' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ASC' ? 1 : -1;
        }
        return 0;
    });

    const handleClickDelete = (idCombo) => {
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
                deleteCombo(idCombo);  
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'El combo ha sido eliminado.',
                    icon: 'success',
                    confirmButtonColor: '#057a55',
                });
            }
        });
    }

    const handleOpenModal = (idCombo) => {
        setIdCombo(idCombo);
        setIsModalOpen(true);
    };
    

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    return ( 
        <div className="overflow-x-auto p-4">
            <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-md">
                <thead className="bg-white rounded-xl text-left shadow">
                    <tr>
                        <th className="px-4 py-2 border-b text-zinc-800 border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Imagen
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b text-zinc-800 border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Codigo
                                <button onClick={() => handleSort('idCombo')} className="ml-2 ">
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
                                Descripción
                                <button onClick={() => handleSort('description')} className="ml-2 ">
                                    <FaSort className="text-zinc-700"/>
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedCombos.map((combo, index) => (
                        <tr 
                            key={combo.idCombo} 
                            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}  
                        >
                            <td className="px-4 py-2 border-b border-b-gray-300">
                                <img src={`${combo.img}`} 
                                    alt={combo.name} 
                                    className="w-12 h-12 object-cover" 
                                />
                            </td>
                            <td className="px-4 py-2 border-b border-b-gray-300">{combo.idCombo}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">{combo.name}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">{combo.description}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">
                                <div className="flex items-center gap-1">
                                    <button 
                                        className="text-green-600 text-2xl hover:text-green-500" 
                                        onClick={()=>onEditCombo(combo)}
                                    >
                                        <FaEdit/>
                                    </button>
                                    <button 
                                        className="text-red-600 text-2xl hover:text-red-500" 
                                        onClick={()=>{
                                            console.log("click eliminar combo:", combo.idCombo)
                                            handleClickDelete(combo.idCombo)}}
                                    > 
                                        <FaTimesCircle/>
                                    </button>
                                    <button 
                                        className="text-blue-600 text-2xl hover:text-blue-500" 
                                        onClick={() => handleOpenModal(combo.idCombo)}
                                    >
                                        <FaPlusCircle/>
                                    </button>
                                    
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <ProductComboContainer idCombo={idCombo} onClose={handleCloseModal} />
            )}
        </div>
    );
};


 
export default ComboList;