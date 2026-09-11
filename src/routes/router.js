const express = require('express');
const router = express.Router();
const crud = require('../middlewares/crud')

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/status', (req, res) => {
    res.render('status', {
        status: 'OK',
        message: 'El servidor está funcionando correctamente.'
    });
});

router.get('/saludo', (req, res) => {
    res.send('<h1>Bienvenidos a ruta pública con respuesta en HTML</h1>')
})

router.get('/usuarios', crud.mostrarUsuarios);

router.put('/usuarios/:id', crud.actualizarCorreo);

router.delete('/usuarios/:id', crud.eliminarUsuario);

router.post('/usuarios', crud.crearUsuario);



module.exports = router;