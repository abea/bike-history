const mongoose = require('mongoose');
const {expect} = require('chai');
const Weather = require('../models/Weather');
const StationDay = require('../models/StationDay');

const basicData = {
  _id: '1234',
  string: 'Whatchamacallit',
  number: 8675309,
  boolean: true,
  array: ['19147']
};

describe('Database', function() {
  // create a sandboxed database connection
  before((done) => {
    mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
    const db = mongoose.connection;

    db.on('error', (err) => {
      console.error('🙅‍ Test database did not connect.');
      done(err);
    });

    db.once('open', () => {
      console.log('🙆‍ Test database connected!');
      done();
    });
  });

  describe('Station save', function() {
    this.timeout(5000);
    it('should succesfully save data.', async () => {
      const station = await (StationDay(basicData)).save();
      expect(station._id).to.equal(basicData._id);
    });
  });

  describe('Weather save', function() {
    this.timeout(5000);
    it('should succesfully save data.', async () => {
      const weather = await (Weather(basicData)).save();
      expect(weather._id).to.equal(basicData._id);
    });
  });

  // After all tests are finished drop database and close connection
  after(function(done) {
    mongoose.connection.db.dropDatabase(function () {
      console.log('👋 Test database dropped and disconnected.');
      mongoose.connection.close(done);
    });
  });
});
