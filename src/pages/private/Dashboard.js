import { HiComputerDesktop } from "react-icons/hi2";
import SalesStatisticsForYear from "../../components/admin/analytics/SalesStatisticsForYear";
import SalesStatistics from "../../components/admin/analytics/SalesStatistics";
import { useState } from "react";
import { Label } from "flowbite-react";
import { Input } from "@mui/material";
import TopProducts from "../../components/admin/analytics/TopProducts";

import { RangeSlider } from "flowbite-react";
import TopCombos from "../../components/admin/analytics/TopCombos";
import StockStatistics from "../../components/admin/analytics/StockStatistics";


const Dashboard = () => {
    //SalesStatistics
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    //SalesStatisticsForYear
    const [selectedYear, setSelectedYear] = useState("2024");

    //TopProducts
    const [limit, setLimit] = useState('5');
    const [startDateProduct, setStartDateProduct] = useState('');
    const [endDateProduct, setEndDateProduct] = useState('');

    //TopCombos
    const [limitCombo, setLimitCombo] = useState('5');
    const [startDateCombo, setStartDateCombo] = useState('');
    const [endDateCombo, setEndDateCombo] = useState('');

    //StockStatistics
    const [startDateStock, setStartDateStock] = useState('');
    const [endDateStock, setEndDateStock] = useState('');
   

    const handleStartDateChange = (e) => {
        // Actualizamos la fecha de inicio
        const formattedStartDate = e.target.value; // Mantener en formato yyyy-MM-dd
        setStartDate(formattedStartDate);
    };

    const handleEndDateChange = (e) => {
        // Actualizamos la fecha de fin
        const formattedEndDate = e.target.value; // Mantener en formato yyyy-MM-dd
        setEndDate(formattedEndDate);
    };

    const handleStartDateProductChange = (e) => {
        // Actualizamos la fecha de inicio
        const formattedStartDate = e.target.value; // Mantener en formato yyyy-MM-dd
        setStartDateProduct(formattedStartDate);
    };

    const handleEndDateProductChange = (e) => {
        // Actualizamos la fecha de inicio
        const formattedEndDate = e.target.value; // Mantener en formato yyyy-MM-dd
        setEndDateProduct(formattedEndDate);
    };

    const handleRangeChange = (value) => {
        // Limitar el valor entre 1 y 5
        const limitedValue = Math.min(Math.max(value, 1), 5);
        setLimit(limitedValue);
    };

    const handleStartDateComboChange = (e) => {
        // Actualizamos la fecha de inicio
        const formattedStartDate = e.target.value; // Mantener en formato yyyy-MM-dd
        setStartDateCombo(formattedStartDate);
    };

    const handleEndDateComboChange = (e) => {
        // Actualizamos la fecha de inicio
        const formattedEndDate = e.target.value; // Mantener en formato yyyy-MM-dd
        setEndDateCombo(formattedEndDate);
    };

    const handleRangeComboChange = (value) => {
        // Limitar el valor entre 1 y 5
        const limitedValue = Math.min(Math.max(value, 1), 5);
        setLimitCombo(limitedValue);
    };

    const handleStartDateStockChange = (e) => {
        // Actualizamos la fecha de inicio
        const formattedStartDate = e.target.value; // Mantener en formato yyyy-MM-dd
        setStartDateStock(formattedStartDate);
    };

    const handleEndDateStockChange = (e) => {
        // Actualizamos la fecha de fin
        const formattedEndDate = e.target.value; // Mantener en formato yyyy-MM-dd
        setEndDateStock(formattedEndDate);
    };



    return (  
        <div className="bg-gray-100 flex flex-col">
            

            {/* Contenedor principal */}
            <div className="bg-gray-100 flex flex-col">
                <div className="bg-white ml-6 mr-6 mt-2 rounded-xl shadow-md">
                    <div className="ml-6 mt-6 flex items-center">
                        <HiComputerDesktop className="text-3xl md:text-4xl lg:text-4xl mb-2 text-gray-900" />
                        <h1 className="ml-2 mb-2 text-4xl font-extrabold poppins-extrabold leading-none tracking-tight text-gray-900">
                            Panel de control.
                        </h1>
                    </div>
                    <div className="ml-6">
                        <p className="text-lg font-normal poppins-light text-gray-500 lg:text-xl dark:text-gray-400 mb-2">
                            Administre su sistema de forma rápida y eficiente con este módulo.
                        </p>
                    </div>
                </div>

                {/* Contenedor principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
                    {/* Fila 1: Ingresos Diarios y Mensuales */}
                    <div className="p-6 bg-white rounded-xl shadow flex-1">
                        <h2 className="mb-2 text-3xl font-extrabold poppins-regular leading-none tracking-tight text-gray-900">
                            Ingresos Diarios
                        </h2>
                        <div className="mb-4 flex gap-4 justify-start">
                            <div>
                                <Label htmlFor="startDate">Desde: </Label>
                                <Input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">Hasta: </Label>
                                <Input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                />
                            </div>
                        </div>
                        <SalesStatistics startDate={startDate} endDate={endDate} />
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow flex-1">
                        <h2 className="mb-2 text-3xl font-extrabold poppins-regular leading-none tracking-tight text-gray-900">
                            Ingresos Mensuales
                        </h2>
                        <div className="mb-1">
                            <Label htmlFor="yearPicker">Año: </Label>
                            <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {Array.from({ length: 5 }, (_, i) => (
                                    <option key={i} value={2024 - i}>
                                        {2024 - i}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <SalesStatisticsForYear year={selectedYear.toString()} />
                    </div>

                    {/* Fila 2: Productos más vendidos y Combos más vendidos */}
                    <div className="p-6 bg-white rounded-xl shadow flex-1">
                        <h2 className="mb-2 text-3xl font-extrabold poppins-regular leading-none tracking-tight text-gray-900">
                            Productos más vendidos
                        </h2>
                        <div className="mb-4 flex gap-4 justify-start">
                            <div>
                                <Label htmlFor="startDate">Desde: </Label>
                                <Input
                                    type="date"
                                    id="startDateProduct"
                                    value={startDateProduct}
                                    onChange={handleStartDateProductChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">Hasta: </Label>
                                <Input
                                    type="date"
                                    id="endDateProduct"
                                    value={endDateProduct}
                                    onChange={handleEndDateProductChange}
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="limitSlider">Cantidad de productos: {limit}</Label>
                            <RangeSlider
                                id="md-range"
                                sizing="md"
                                value={limit}
                                min={1}
                                max={5}
                                onChange={(e) => handleRangeChange(Number(e.target.value))}
                                className="w-44 accent-blue-500"
                            />
                        </div>
                        <TopProducts limit={limit} startDate={startDateProduct} endDate={endDateProduct} />
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow flex-1">
                        <h2 className="mb-2 text-3xl font-extrabold poppins-regular leading-none tracking-tight text-gray-900">
                            Combos más vendidos
                        </h2>
                        <div className="mb-4 flex gap-4 justify-start">
                            <div>
                                <Label htmlFor="startDate">Desde: </Label>
                                <Input
                                    type="date"
                                    id="startDateCombo"
                                    value={startDateCombo}
                                    onChange={handleStartDateComboChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">Hasta: </Label>
                                <Input
                                    type="date"
                                    id="endDateCombo"
                                    value={endDateCombo}
                                    onChange={handleEndDateComboChange}
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="limitSlider">Cantidad de combos: {limitCombo}</Label>
                            <RangeSlider
                                id="md-range"
                                sizing="md"
                                value={limitCombo}
                                min={1}
                                max={5}
                                onChange={(e) => handleRangeComboChange(Number(e.target.value))}
                                className="w-44 accent-blue-500"
                            />
                        </div>
                        <TopCombos limit={limitCombo} startDate={startDateCombo} endDate={endDateCombo} />
                    </div>

                    {/* Fila 3: Stock */}
                    <div className="p-6 bg-white rounded-xl shadow col-span-2 w-full">
                        <h2 className="mb-2 text-3xl font-extrabold poppins-regular leading-none tracking-tight text-gray-900">
                            Registros de Stock
                        </h2>
                        <div className="mb-4 flex gap-4 justify-start">
                            <div>
                                <Label htmlFor="startDate">Desde: </Label>
                                <Input
                                    type="date"
                                    id="startDateStock"
                                    value={startDateStock}
                                    onChange={handleStartDateStockChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">Hasta: </Label>
                                <Input
                                    type="date"
                                    id="endDateStock"
                                    value={endDateStock}
                                    onChange={handleEndDateStockChange}
                                />
                            </div>
                        </div>
                        <StockStatistics startDate={startDateStock} endDate={endDateStock} />
                    </div>
                </div>
            </div>

                            


        </div>


    );
}

export default Dashboard;
