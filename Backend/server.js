const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(bodyParser.json()); // Para poder leer datos enviados por POST
app.use(bodyParser.urlencoded({ extended: true })); // Para poder leer datos enviados por POST

// Servir archivos estáticos desde el directorio "static"
app.use('/static', express.static(path.join(__dirname, 'static')));
// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, 'public')));

app.use('/chartjs', express.static(path.join(__dirname, 'node_modules/chart.js/dist')));
// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});
//Base de datos en MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Estado: Conectado a la base de datos');
});

app.post('/api/pagos', (req, res) => {
    const { tipo_pago, cantidad, fecha } = req.body;
    const query = `INSERT INTO pagos (tipo_pago, cantidad, fecha) VALUES (?, ?, ?)`;
    db.query(query, [tipo_pago, cantidad, fecha], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Pago registrado exitosamente');
    });
});
app.get('/api/pagos/:mes', (req, res) => {
    const mes = req.params.mes;
    const query = `SELECT pagos.id, tipos_pago.nombre as tipo_pago, pagos.cantidad, pagos.fecha FROM pagos
                   JOIN tipos_pago ON pagos.tipo_pago = tipos_pago.id
                   WHERE MONTH(pagos.fecha) = ?
                   ORDER BY pagos.id ASC;`;
    db.query(query, [mes], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});
app.get('/api/suma_pagos/:mes', (req, res) => {
    const mes = req.params.mes;
    const query = `SELECT SUM(cantidad) as total FROM pagos WHERE MONTH(fecha) = ?`;
    db.query(query, [mes], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result[0]);
    });
});
app.get('/api/suma_pagos_por_mes', (req, res) => {
    const query = `SELECT MONTH(fecha) as mes, SUM(cantidad) as total FROM pagos GROUP BY MONTH(fecha) ORDER BY MONTH(fecha)`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});
// Ruta para agregar un nuevo tipo de pago
app.post('/api/tipos_pago', (req, res) => {
    const { nombre } = req.body;
    const query = `INSERT INTO tipos_pago (nombre) VALUES (?)`;
    db.query(query, [nombre], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Tipo de pago agregado exitosamente');
    });
});
app.get('/api/tipos_pago', (req, res) => {
    const query = `SELECT * FROM tipos_pago`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});
app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});