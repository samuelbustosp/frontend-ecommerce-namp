import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import useFetchSalesForYear from '../../../hooks/analytics/useFetchSalesForYear';

const SalesStatisticsForYear = ({ year }) => {
    const { salesData, loading, error } = useFetchSalesForYear(year);

    // Si los datos están siendo cargados o hay un error
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    // Transformar los datos para el gráfico circular
    const chartData = salesData.map((item, index) => ({
        id: `Mes ${index + 1}`, // Ejemplo: Mes 1, Mes 2, etc.
        value: item.monthly_income, // Usa el campo adecuado de la API
        label: item.month_name, // Usa el nombre del mes si está disponible
    }));

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
                        cy: 170,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                width={570}
                height={350}
            />
        </div>
    );
};

export default SalesStatisticsForYear;
