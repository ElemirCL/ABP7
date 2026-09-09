const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, '../logs/log.txt');

const registrarVisita = (ruta) => {
    const ahora = new Date();

    const fecha = ahora.toLocaleDateString('es-CL');
    const hora = ahora.toLocaleTimeString('es-CL');

    const registro = `${fecha}, ${hora} - Ruta accedida: ${ruta}\n`;

    fs.appendFile(rutaArchivo, registro, (error) => {
        if (error) {
            console.error('Error al registrar la visita:', error);
        }
    });
};

module.exports = {
    registrarVisita
};