const pool = require('../dbConfig/db');
const { param } = require('../router');
// async function mostrarUsuarios() {
//     try {
//         await pool.connect();
//         const result = await pool.query(
//             `SELECT ${CAMPOS_USUARIO} FROM usuarios;`,
//         );
//         console.log(`result con pool.query() ${result.rowCount} usuarios`);
//         return result.rows;
//     } catch (err) {
//         console.error('Error en la obtención de usuarios: ', err.code, err.message);
//     } finally {
//         await pool.end();
//         console.log('Conexión cerrada');
//     }
// }


const mostrarUsuarios = async (req, res) => {

    const CAMPOS_USUARIO = 'nombre, correo, fecha_registro';
    try {
        const query = `SELECT ${CAMPOS_USUARIO}  FROM usuarios ORDER BY id;`;
        const result = await pool.query(query);
        if (result.rowCount === 0) {
            console.log('No hay usuarios registrados.');
            return res.status(404).json({
                error: 'No hay usuarios registrados.'
            });
        }
        console.log(`Usuarios encontrados: ${result.rowCount}`);
        res.json({
            mensaje: 'Lista de usuarios',
            total: result.rowCount,
            usuarios: result.rows
        })
    } catch (error) {
        console.error(`Error al listar usuarios: ${error.code} - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    mostrarUsuarios
}