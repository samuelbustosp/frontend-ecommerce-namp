import { BarChart } from "@mui/x-charts";

import useFetchSalesStats from './../../../hooks/analytics/useFetchSalesStats'; // Importar el hook

const SalesStatistics = ({ startDate, endDate }) => {

    // Usar el hook para obtener los datos, pasándoles las fechas
    const { salesData, loading, error } = useFetchSalesStats(startDate, endDate);

    // Si los datos están siendo cargados o hay un error
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    // Preparar los datos para el gráfico
    const categories = salesData.map(item => new Date(item.dayname).toDateString()); // Fechas (eje X)
    const values = salesData.map((item) => item.daily_income); // Valores (eje Y)

    console.log("salesData:", salesData);
    console.log("categories (xAxis):", categories);
    console.log("values (yAxis):", values);


    return (
        <div className="flex flex-col items-center justify-center">
            {/* BarChart */}
            <BarChart
                series={[{
                    data: values, // Valores (eje Y)
                    label: "Ingresos",
                    color: '#0b1c8f',
                }]}
                xAxis={[{
                    scaleType: "band",
                    data: categories, // Fechas (eje X)
                }]}
                borderRadius={20}
                width={650}
                height={350}
                sx={{
                    marginLeft: 'auto', // Mueve el gráfico hacia la derecha
                    marginRight: 'auto', // Mueve el gráfico hacia la izquierda
                    marginTop: '20px', // Mueve el gráfico hacia abajo
                    marginBottom: '20px', // Mueve el gráfico hacia arriba
                    display: 'block', // Asegura que el gráfico sea un bloque y pueda centrarse
                }}
            />
        </div>
    );
};

export default SalesStatistics;
