
const express = require('express');
require('dotenv').config();
const { dbConection } = require('./database/config');

console.log( process.env)
// create service express
const app = express();

// DB
dbConection()

//directorio publico
app.use( express.static('public') );

// lectura y parseo del body
app.use( express.json() );

//rutas
app.use('/api/auth', require('./routes/auth'));
// TODO: CRUD: eventos



// listen to requests
app.listen( process.env.PORT, ()  => {
    console.log(`Servidor corriendo en puerto ${ 5001 }`);
});