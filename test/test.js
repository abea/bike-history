const mongoose = require('mongoose');
// const {expect} = require('chai');

// const Weather = require('../models/Weather');
// const StationDay = require('../models/StationDay');
require('dotenv').config({ path: `${__dirname}/../variables.env` });

describe('Adding stations', function() {
  // Before starting the test, create a sandboxed database connection
  before((done) => {
    mongoose.connect('mongodb://localhost/tests');
    const db = mongoose.connection;

    db.on('error', (err) => { done(err); });

    db.once('open', () => { done(); });
  });

  describe('Station save', function() {
    it('should fail if missing the kioskId field', async () => {
      // Hit route with bad station data as req.body.
      // Route processes the data, trying to save the station update.
      // Data processing fails because there's no kioskId.

      // const stationData = {
      //   addressStreet: '1168 E. Passyunk',
      //   addressCity: 'Philadelphia',
      //   addressState: 'PA',
      //   addressZipCode: '19147'
      // };

      // expect(saver).to.throw();
    });
  });

  // After all tests are finished drop database and close connection
  after(function(done) {
    mongoose.connection.db.dropDatabase(function () {
      mongoose.connection.close(done);
    });
  });
});
