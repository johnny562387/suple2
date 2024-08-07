// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para procesar el formulario
app.post('/agregar-producto', (req, res) => {
    const { nombre, precio, iva } = req.body;
    const precioFinal = parseFloat(precio) + (parseFloat(precio) * (parseFloat(iva) / 100));

    // Inserta en la base de datos
    db.run(`INSERT INTO productos (nombre, precio, iva, precio_final) VALUES (?, ?, ?, ?)`, [nombre, precio, iva, precioFinal], (err) => {
        if (err) {
            console.error(err.message);
        }
        res.render('resultado', { nombre, precio, iva, precioFinal });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
