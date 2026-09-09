const pool = require('../config/db');

const mostrarUsuarios = async (req, res) => {

    const CAMPOS_USUARIO = 'id, nombre, correo, fecha_registro';
    try {
        const query = `SELECT ${CAMPOS_USUARIO}  FROM usuarios ORDER BY id;`;
        const resultado = await pool.query(query);
        if (resultado.rowCount === 0) {
            console.log('No hay usuarios registrados.');
            return res.status(404).json({
                error: 'No hay usuarios registrados.'
            });
        }
        console.log(`Usuarios encontrados: ${resultado.rowCount}`);
        res.json({
            mensaje: 'Lista de usuarios',
            total: resultado.rowCount,
            usuarios: resultado.rows
        })
    } catch (error) {
        console.error(`Error al listar usuarios: ${error.code} - ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const actualizarCorreo = async (req, res) => {
    const { id } = req.params;
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({
            error: 'El nuevo correo es requerido'
        });
    }
    try {
        const query = 'UPDATE usuarios SET correo = $1 WHERE id = $2 RETURNING nombre, correo, fecha_registro;'
        const parametros = [correo, id]
        const resultadoado = await pool.query(query, parametros);
        if (resultadoado.rowCount > 0) {
            res.json({
                mesaje: 'Usuario actualizado',
                usuario: resultadoado.rows[0]
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.mensaje });
    }
}

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id) || parseInt(id) <= 0) {
    console.log('ID ingresado no es válido.');
    return res.status(400).json({
      error: "Debe ingresar ID válido."
    })
  }

  try {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING nombre, email;';
    const parametros = [parseInt(id)];
    const resultado = await pool.query(query, parametros);

    if (resultado.rowCount === 0) {
      console.log('No se encontró usuario.')
      return res.status(404).json({
        error: "No se encontró usuario"
      })
    }
    console.log(`Usuario eliminado. cantidad de registros afectados: ${resultado.rowCount}`);
    res.json({
      mensaje: "Usuario eliminado correctamente",
      registroEliminados: resultado.rowCount,
      usuarioEliminado: resultado.rows[0],
    });
  } catch (error) {
    console.log(`Error al eliminar usuario: ${error.message}`);
    res.status(500).json({ error: error.message });
    if (error.code === "23503") {
      return res.status(409).json({
        error: "No se puede eliminar usuario",
      });
    }
  }
};
module.exports = {
    mostrarUsuarios,
    actualizarCorreo,
    eliminarUsuario
}