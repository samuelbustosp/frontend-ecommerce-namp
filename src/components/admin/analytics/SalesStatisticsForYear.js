import React, { useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Label, Select } from "flowbite-react";

const SalesStatisticsForYear = () => {
    const [selectedYear, setSelectedYear] = useState(2024)
    const yearlyData = {
        2023: [
            { id: 0, value: 4467, month: 'January' },
            { id: 1, value: 8413, month: 'February' },
            { id: 2, value: 13498, month: 'March' },
            { id: 3, value: 13351, month: 'April' },
            { id: 4, value: 6914, month: 'May' },
            { id: 5, value: 4311, month: 'June' },
            { id: 6, value: 11342, month: 'July' },
            { id: 7, value: 2895, month: 'August' },
            { id: 8, value: 3551, month: 'September' },
            { id: 9, value: 12610, month: 'October' },
            { id: 10, value: 9896, month: 'November' },
            { id: 11, value: 7302, month: 'December' },
        ],
        2024: [
            { id: 0, value: 5467, month: 'January' },
            { id: 1, value: 9413, month: 'February' },
            { id: 2, value: 14498, month: 'March' },
            { id: 3, value: 14351, month: 'April' },
            { id: 4, value: 79140, month: 'May' },
            { id: 5, value: 53112, month: 'June' },
            { id: 6, value: 12342, month: 'July' },
            { id: 7, value: 3895, month: 'August' },
            { id: 8, value: 4551, month: 'September' },
            { id: 9, value: 13610, month: 'October' },
            { id: 10, value: 10896, month: 'November' },
            { id: 11, value: 83020, month: 'December' },
        ],
    };
    const dataForSelectedYear = yearlyData[selectedYear]; 

    return (
        <div>
            <div className='flex items-center justify-center gap-2 mt-4'>
                <Label htmlFor="year">Seleccionar año: </Label>
                <Select
                    value={selectedYear}
                    onChange={(e)=>setSelectedYear(Number(e.target.value))}
                    className=' w-1/5'
                >
                    {Object.keys(yearlyData).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </Select>
            </div>
            
            <PieChart
                series={[
                    {
                        data: dataForSelectedYear, 
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
