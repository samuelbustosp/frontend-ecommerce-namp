import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import useFetchSalesForYear from '../../../hooks/analytics/useFetchSalesForYear';

const SalesStatisticsForYear = ({ year }) => {
    const { salesData, loading, error } = useFetchSalesForYear(year);

    // Si los datos están siendo cargados o hay un error
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    // Verifica la estructura de los datos
    console.log("Datos recibidos:", salesData);

    if (!salesData || salesData.length === 0) {
        return <div>No hay datos disponibles para el año seleccionado.</div>;
    }

    // Array con los nombres de los meses
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Transformar los datos para el gráfico circular
    const chartData = salesData.map(item => {
        const monthIndex = item.monthname - 1; // Ajuste para índices del array
        return {
            id: `Mes ${item.monthname}`, // Identificador único
            value: item.monthly_income || 0, // Evita errores si `monthly_income` es nulo
            label: monthNames[monthIndex] || `Mes ${item.monthname}`, // Usa el nombre del mes o un fallback
        };
    });

    console.log("Datos transformados para el gráfico:", chartData);

    return (
        <div>
            <PieChart
                series={[
                    {
                        data: chartData,
                        innerRadius: 20,
                        outerRadius: 130,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        startAngle: -45,
                        cx: 300,
                        cy: 160,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                width={570}
                height={340}
            />
        </div>
    );
};

export default SalesStatisticsForYear;
