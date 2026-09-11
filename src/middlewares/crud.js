const pool = require('../config/db');
const { registrarUsuario } = require('../helpers/gestorLog');

const crearUsuario = async (req, res) => {

  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Nombre - Correo - Contraseña son requeridos' });
  }

  try {
    await pool.query('BEGIN');
    const query = `INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id;`;
    const values = [nombre, correo, contrasena];
    const resultado = await pool.query(query, values);
    const id = resultado.rows[0].id;
    res.status(201).json({
      mensaje: 'Usuario insertado',
      id: resultado.id
    });

    registrarUsuario(id, 'creado');
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({
      error: error.message,
      code: error.code,
      mensaje: 'Se ejecuta ROLLBACK: ningún cambio se aplicó.'
    });
  }
};

const mostrarUsuarios = async (req, res) => {

  const CAMPOS_USUARIO = 'id, nombre, correo, fecha_registro';
  await pool.connect();
  try {
    const query = `SELECT ${CAMPOS_USUARIO}  FROM usuarios ORDER BY id;`;
    const resultado = await pool.query(query);
    if (resultado.rowCount === 0) {
      console.log('No hay usuarios registrados.');
      res.status(404).json({
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
    return res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
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
    const resultado = await pool.query(query, parametros);
    if (resultado.rowCount > 0) {
      registrarUsuario(id, 'actualizado');
      res.json({
        mesaje: 'Usuario actualizado',
        usuario: resultado.rows[0]
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
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING nombre, correo, contrasena;';
    const parametros = [parseInt(id)];
    const resultado = await pool.query(query, parametros);

    if (resultado.rowCount === 0) {
      console.log('No se encontró usuario.')
      return res.status(404).json({
        error: "No se encontró usuario"
      })
    }
    console.log(`Usuario eliminado. cantidad de registros afectados: ${resultado.rowCount}`);
    registrarUsuario(id, 'eliminado');
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
  eliminarUsuario,
  crearUsuario
}