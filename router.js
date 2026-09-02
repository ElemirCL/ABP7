const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/status', (req, res) => {
    res.render('status', {
        status: 'OK',
        message: 'El servidor está funcionando correctamente.'
    });
});

router.get('/saludo',(req,res)=>{
    res.send('<h1>Bienvenidos a ruta pública con respuesta en HTML</h1>')
})

module.exports = router;