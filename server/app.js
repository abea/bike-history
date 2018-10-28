const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 7777);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

module.exports = app;
