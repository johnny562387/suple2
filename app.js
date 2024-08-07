const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conectar a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu servidor no está en localhost
    user: 'tu_usuario', // Tu usuario de MySQL
    password: 'tu_contraseña', // Tu contraseña de MySQL
    database: 'productos_db' // Nombre de tu base de datos
});

// Verifica la conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
});

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para guardar el producto
app.post('/add-product', (req, res) => {
    const { nombre, precio, iva } = req.body;
    const total = parseFloat(precio) + (parseFloat(precio) * (parseFloat(iva) / 100));

    db.query(`INSERT INTO productos (nombre, precio, iva, total) VALUES (?, ?, ?, ?)`, [nombre, precio, iva, total], (err, result) => {
        if (err) {
            return console.error(err.message);
        }
        res.send(`Producto añadido: ${nombre} con total: ${total.toFixed(2)}`);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
