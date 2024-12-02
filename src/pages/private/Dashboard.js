import { HiComputerDesktop } from "react-icons/hi2";
import SalesStatisticsForYear from "../../components/admin/analytics/SalesStatisticsForYear";
import SalesStatistics from "../../components/admin/analytics/SalesStatistics";
import { useState } from "react";
import { Label } from "flowbite-react";
import { Input } from "@mui/material";
import YearPickerExample from "../../components/admin/analytics/YearPickerComponent";


const Dashboard = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedYear, setSelectedYear] = useState("2024");

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

    return (  
        <div className="bg-gray-100 flex flex-col">
            <div className="bg-white ml-6 mr-6 mt-2 rounded-xl shadow-md">
                <div className="ml-6 mt-6 flex items-center">  
                    <HiComputerDesktop className="text-3xl md:text-4xl lg:text-4xl mb-2 text-gray-900" /> 
                    <h1 className="ml-2 mb-2 text-4xl font-extrabold poppins-extrabold leading-none tracking-tight text-gray-900 ">Panel de control.</h1> 
                </div>
                <div className='ml-6'>
                    <p className="text-lg font-normal poppins-light text-gray-500 lg:text-xl dark:text-gray-400 mb-2">Administre su sistema de forma rápida y eficiente con este módulo.</p>
                </div>
            </div>

            <div className="ml-6 mr-6 mt-4 flex flex-wrap items-start justify-center gap-4 max-w-screen overflow-x-hidden">
                {/* Inputs para seleccionar las fechas */}
                

                {/* Gráficos o estadísticas */}
                <div className="p-6 bg-white rounded-xl shadow flex-1 min-w-[300px] max-w-[650px]">
                    <h2 className="mb-2 text-3xl font-extrabold poppins-regular leading-none tracking-tight text-gray-900">
                        Ingresos Diarios
                    </h2>
                    <div className="mb-4 flex gap-4 justify-start">
                        <div>
                            <Label htmlFor="startDate">Desde: </Label>
                            <Input
                                type="date"
                                id="startDate"
                                value={startDate}  // Se usa el formato yyyy-MM-dd directamente
                                onChange={handleStartDateChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="endDate">Hasta: </Label>
                            <Input
                                type="date"
                                id="endDate"
                                value={endDate}  // Se usa el formato yyyy-MM-dd directamente
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </div>
                    <SalesStatistics startDate={startDate} endDate={endDate} />
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow-md flex-1 min-w-[300px] max-w-[650px]">
                    <h2 className="mb-2 text-3xl font-extrabold poppins-regular leading-none tracking-tight text-gray-900">
                        Ingresos Mensuales
                    </h2>
                    <div className="mb-4">
                        <Label htmlFor="yearPicker">Año: </Label>
                        <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={2024 - i}>
                                    {2024 - i} {/* Genera años desde 2024 hacia atrás */}
                                </option>
                            ))}
                        </select>
                    </div>
                    <SalesStatisticsForYear year={selectedYear.toString()} /> {/* Pasa el año como prop */}
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
