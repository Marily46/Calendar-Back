
const express = require('express');
require('dotenv').config();
const { dbConection } = require('./database/config');
const cors = require('cors');

console.log( process.env)
// create service express
const app = express();

// DB
dbConection()

//cors
app.use(cors());

//directorio publico
app.use( express.static('public') );

// lectura y parseo del body
app.use( express.json() );

//rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
// TODO: CRUD: eventos


// listen to requests
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
}).on('error', (err) => {
    console.error('Error al iniciar el servidor:', err);
});
