import { useState } from "react";
import { FaEdit, FaSort } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import Swal from "sweetalert2";

const DiscountCouponList = ({ discountCoupons, deleteDiscountCoupon, onEditDiscountCoupon }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ASC' });

    const handleSort = (columnKey) => {
        let direction = 'ASC';
        if (sortConfig.key === columnKey && sortConfig.direction === 'ASC') {
            direction = 'DESC';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const sortedCoupons = [...discountCoupons].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ASC' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ASC' ? 1 : -1;
        }
        return 0;
    });

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
                deleteDiscountCoupon(id);
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'El cupón ha sido eliminado.',
                    icon: 'success',
                    confirmButtonColor: '#057a55',
                });
            }
        });
    };

    return (
        <div className="overflow-x-auto p-4">
            <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-md">
                <thead className="bg-white text-left shadow">
                    <tr>
                        <th className="px-4 py-2 border-b text-zinc-800 border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Código
                                <button onClick={() => handleSort('codigo')} className="ml-2">
                                    <FaSort className="text-zinc-700" />
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b text-zinc-800 border-b-gray-300 poppins-semibold">
                            <div className="flex items-center">
                                Descuento
                                <button onClick={() => handleSort('descuento')} className="ml-2">
                                    <FaSort className="text-zinc-700" />
                                </button>
                            </div>
                        </th>
                        <th className="px-4 py-2 border-b text-zinc-800 border-b-gray-300 poppins-semibold">
                            Vigente
                        </th>
                        <th className="px-4 py-2 border-b border-b-gray-300 poppins-semibold">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedCoupons.map((cupon, index) => (
                        <tr key={cupon.idDiscountCoupon} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="px-4 py-2 border-b border-b-gray-300">{cupon.code}</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">{cupon.discount}%</td>
                            <td className="px-4 py-2 border-b border-b-gray-300">
                                {cupon.current ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Activo
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Inactivo
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-2 border-b border-b-gray-300">
                                <div className="flex items-center gap-2">
                                    <button className="text-green-600 text-2xl hover:text-green-500" onClick={() => onEditDiscountCoupon(cupon)}>
                                        <FaEdit />
                                    </button>
                                    <button className="text-red-600 text-3xl hover:text-red-500" onClick={() => handleClickDelete(cupon.idDiscountCoupon)}>
                                        <TiDelete />
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

export default DiscountCouponList;
