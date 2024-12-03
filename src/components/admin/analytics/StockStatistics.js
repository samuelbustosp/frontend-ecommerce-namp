import { BarChart } from "@mui/x-charts";
import useFetchStockStats from "../../../hooks/analytics/useFetchStockStats";

const StockStatistics = ({ startDate, endDate }) => {

    // Usar el hook para obtener los datos, pasándoles las fechas
    const { stockData, loading, error } = useFetchStockStats(startDate, endDate);
    

    // Si los datos están siendo cargados o hay un error
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    // Preparar los datos para el gráfico
    const categories = stockData.map(item => item.productname); // Fechas (eje X)
    const values = stockData.map((item) => item.total_stock); // Valores (ejestock
    console.log("Data:", stockData);
    console.log("categories (xAxis):", categories);
    console.log("values (yAxis):", values);


    return (
        <div className="flex flex-col items-center justify-center">
            {/* BarChart */}
            <BarChart
                series={[{
                    data: values, // Valores (eje Y)
                    label: "Unidades",
                    color: '#0b1c8f',
                }]}
                xAxis={[{
                    scaleType: "band",
                    data: categories, // Fechas (eje X)
                }]}
                borderRadius={20}
                width={650}
                height={340}
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

export default StockStatistics;
