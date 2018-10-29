const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 7777);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  // NOTE: https://enable-cors.org/server_expressjs.html
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/', routes);

module.exports = app;
