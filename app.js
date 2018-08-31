const express = require('express');
const routes = require('./routes/index');

const app = express();

app.set('port', process.env.PORT || 7777);

app.use('/', routes);

module.exports = app;
