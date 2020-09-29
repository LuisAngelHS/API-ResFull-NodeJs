const express = require('express');
const mysql = require('mysql');
const cors = require('cors')

const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3040;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//MYsql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'almacenes'
});

//RUTAS..
app.get('/', (req, res) => {
    res.send('BIENVENIDOS A NODEJS!');
});

// Obtenemos todos los registros de nuestra bd
app.get('/Productos', cors(), (req, res) => {
    const sql = 'SELECT * FROM productos';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Not result');
        }
    });
});

//Obtenemos un registro por id..
app.get('/Producto/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM productos WHERE Producto = ${id}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    });
});

//Agregamos nuevo producto...
app.post('/AddProducto', (req, res) => {
    const sql = 'INSERT INTO productos SET ?';
    const customerObj = {
        Nombre: req.body.name,
        Precio: req.body.precio
    };
    if (customerObj.Nombre) {
        connection.query(sql, customerObj, (error, result) => {
            if (error) {
                res.json({ Cve_Error: -1, Cve_Mensaje: 'error en la base de datos ' });
            } else {
                res.json({ Cve_Error: 0, id: result.insertId });
            }
        });
    } else {
        res.json({ Cve_Error: -1, Cve_Mensaje: 'No se ha introducido ningun dato' });

    }
});

//Actulizar producto...
app.put('/UpdateProdcuto/:id', (req, res) => {
    const { id } = req.params;
    const customerObj = {
        id: req.body.Producto,
        Nombre: req.body.Nombre,
        Precio: req.body.Precio
    };
    const sql = `UPDATE productos SET Nombre = '${customerObj.Nombre}', Precio='${customerObj.Precio}' WHERE Producto= ${id}`;

    connection.query(sql, error => {
        if (error) {
            res.json({ Cve_Error: id, Cve_Mensaje: 'error en la base de datos ' });
        } else {
            res.json({ Cve_Error: 0, Mensaje: 'Producto Actualizado' });
        }
    });
});

//Eliminar por ID.. 
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM productos WHERE Producto= ${id}`;

    connection.query(sql, error => {
        if (error) {
            res.json({ Cve_Error: error, Cve_Mensaje: 'error en la base de datos ' });
        } else {
            res.json({ Cve_Error: 0, Mensaje: 'Producto Eliminado' });
        }
    });
});


//checar conexión
connection.connect(err => {
    if (err) throw err;
    console.log('conexion exitosa');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})