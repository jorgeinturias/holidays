import React, { useState, useEffect } from 'react';
import datosFestivos from '../holidays.json';

const ListaFestivos = () => {
    const [festivos, setFestivos] = useState([]);

    // Función para calcular la fecha de Pascua
    const calcularPascua = (year) => {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
    
        return new Date(year, month - 1, day);
    };

    // Función para formatear la fecha a "January 1st"
    const formatearFecha = (fecha) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        let fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);

        // Encontrar y cambiar a mayúscula la primera letra del mes
        fechaFormateada = fechaFormateada.replace(/(?:\s|^)(\w)/, (match, p1) => p1.toUpperCase());

        return fechaFormateada;
    };

    // Función para calcular el día de la semana
    const calcularDiaSemana = (fecha) => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[fecha.getDay()];
    };

    useEffect(() => {
        const year = new Date().getFullYear();
        const pascua = calcularPascua(year);

        const festivosProcesados = datosFestivos.map(festivo => {
            let fecha;

            if (festivo.rule.startsWith('%EASTER')) {
                // Calcular fecha basada en Pascua
                let offset = parseInt(festivo.rule.split(' ')[1]) || 0;
                fecha = new Date(pascua.getTime());
                fecha.setDate(fecha.getDate() + offset);
            } else {
                // Convertir la regla a una fecha
                let [month, day] = festivo.rule.split(' ');
                day = day.replace(/(st|nd|rd|th)/, ''); // Remover sufijos como 'st', 'nd', etc.
                fecha = new Date(`${month} ${day}, ${year}`);
            }

            return {
                name: festivo.name,
                fecha: formatearFecha(fecha),
                fechaOriginal: fecha, // Objeto Date original
                diaSemana: calcularDiaSemana(fecha)
            };
        });
        festivosProcesados.sort((a, b) => a.fechaOriginal - b.fechaOriginal);

        setFestivos(festivosProcesados);
    }, []);

    return (
        <table>
            <tr>
                <th>Fecha</th>
                <th>Dia</th>
                <th>Feriado</th>
            </tr>
            {festivos.map((festivo, index) => (
                <tr key={index}>
                    <td>{festivo.fecha}</td>
                    <td>{festivo.diaSemana}</td>
                    <td>{festivo.name}</td>
                </tr>
            ))}
        </table>
    );
};

export default ListaFestivos;
