const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const heroesRouter = require('./routes/api/heroes');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// A partir de aqui se pueden crear nuevos grupos de servicios o servicios individuales usando como referencia la sig. linea.
// Revisar el archivo en el directorio 'routes/api/heroes.js'
app.use('/api/heroes', heroesRouter); // Se registran todos los servicios de Heroes (CRUD)

module.exports = app;
