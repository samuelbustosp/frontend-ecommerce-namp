import React, { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';   
import dayjs from 'dayjs';  // Importa dayjs 


const YearPickerExample = ({selectedYear, setSelectedYear}) => {
    const currentYear = new Date().getFullYear();  // Año actual
    const fiveYearsAgo = currentYear - 5;


    const handleYearChange = (newYear) => {
        // Convertir el objeto Date a un string con el formato de año (YYYY)
        const yearString = newYear ? newYear.year().toString() : '';
        setSelectedYear(yearString);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                date={selectedYear}
                onChange={handleYearChange}
                label={'Seleccione un año'}
                views={["year"]} 
                minDate={dayjs(`${fiveYearsAgo}-01-01`)}  // Hace 5 años
                maxDate={dayjs(`${currentYear}-12-31`)}
                sx={{
                    '& .MuiDateCalendar-root': {
                            display: 'none', // Ocultar el calendario de días
                        },
                        '& .MuiPickersYear-root': {
                            width: 'auto', // Cambiar el tamaño de los elementos del dropdown
                            maxWidth: '200px', // Ajustar el tamaño máximo del dropdown
                            overflow: 'hidden', // Evitar desbordes
                        },
                        // Intentar especificar más directamente para el dropdown de años
                        '& .MuiPickersYear-button': {
                            width: 'auto', // Ajustar el tamaño de los botones de año
                            maxWidth: '200px',
                            overflow: 'hidden',
                        },
                }}
            />
        </LocalizationProvider>
    );
};

export default YearPickerExample;
