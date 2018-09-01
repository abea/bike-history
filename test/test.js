const mongoose = require('mongoose');
const Weather = require('../models/Weather');
// const StationDay = require('../models/StationDay');
require('dotenv').config({ path: `${__dirname}/../variables.env` });

describe('Weather', function() {
  // Before starting the test, create a sandboxed database connection
  before(function (done) {
    mongoose.connect('mongodb://localhost/tests');
    const db = mongoose.connection;

    db.on('error', (err) => { done(err); });

    db.once('open', () => { done(); });
  });

  // After all tests are finished drop database and close connection
  after(function(done) {
    mongoose.connection.db.dropDatabase(function () {
      mongoose.connection.close(done);
    });
  });
});
