import { List } from "flowbite-react";
import useFetchTopProducts from "../../../hooks/analytics/useFetchTopProducts";
import { PiWineFill } from "react-icons/pi";

const TopProducts = ({ limit, startDate, endDate }) => {
    const { productsData, loading, error } = useFetchTopProducts(limit, startDate, endDate);

    
    if (error) return <div>Error: {error}</div>;
    return (
        <div className="max-w-md h-[400px]">
            {/* Encabezados */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse px-4 py-2 bg-gray-200 dark:bg-gray-800">
                <div className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300">Producto</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cant. Vendido</div>
            </div>

            {/* Lista */}
            <List
                unstyled
                className="divide-y divide-gray-200 dark:divide-gray-700 px-4 overflow-y-auto max-h-96"
            >
                {productsData.map((prod, index) => (
                    <List.Item key={index} className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="bg-blue-800 text-white rounded-full text-2xl">
                                <PiWineFill className="w-10 h-10" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {prod.product}
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                {prod.total_sold || 0}
                            </div>
                        </div>
                    </List.Item>
                ))}
            </List>
        </div>
    );
};

export default TopProducts;
