const mongoose = require('mongoose');
const request = require('request-promise');
const chai = require('chai');
chai.use(require('chai-match'));
const expect = chai.expect;
const StationDay = require('../models/StationDay');
require('../models/Weather');
require('../models/StationDay');
const sampleWeather = require('../sample-data/weather-dump.json');
const sampleStations = require('../sample-data/indego-dump.json');
const express = require('express');
const routes = require('../routes/index');
const bodyParser = require('body-parser');
const app = express();
const moment = require('moment-timezone');
let server;

require('dotenv').config({ path: `${__dirname}/../variables.env` });

const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather';

describe('Open Weather', function() {
  it('should receive a response from the weather API with key.', async () => {
    const reqOptions = {
      uri: `${weatherUrl}?appid=${process.env.WEATHER_KEY}&id=${process.env.WEATHER_CITY_ID}`,
      json: true
    };

    const result = await request(reqOptions)
      .then(result => {
        return result;
      })
      .catch(err => {
        console.error(err);
        throw Error('API key isn\'t working.');
      });

    expect(result.cod).to.equal(200);
  });
});

describe('Database', function() {
  // create a sandboxed database connection
  before((done) => {
    app.use(bodyParser.json());
    app.use('/', routes);
    app.set('port', process.env.PORT || 7777);
    mongoose.connect('mongodb://localhost/post_test', {
      useNewUrlParser: true
    });
    const db = mongoose.connection;

    db.on('error', (err) => {
      console.error('🙅‍ Test database did not connect.');
      done(err);
    });

    db.once('open', () => {
      console.log('🙆‍ Test database connected!');
    });

    server = app.listen(app.get('port'), () => {
      console.log(`Express running on port ${server.address().port}`);
      done();
    });
  });

  describe('Weather Post', function() {
    it('should receive a document with _id back of the date.', async () => {
      let result = {};
      const timestamp = (new Date()).toISOString();
      const datestamp = moment(timestamp).tz("America/New_York").format('YYYY-MM-DD');

      const weatherPostOptions = {
        method: 'POST',
        uri: `${process.env.ROOT_URL}/api/v1/post/weather`,
        body: {
          timestamp,
          weather: sampleWeather
        },
        json: true
      };

      await request(weatherPostOptions)
        .then(res => {
          result = res;
          console.log(res._id);
          console.log(datestamp);
        })
        .catch(err => {
          console.error(err.error);
        });

      expect(result._id).to.equal(datestamp);
    });

    it('should have data for the hour when sent.', async () => {
      let result = {};
      const timestamp = (new Date()).toISOString();
      const hour = (new Date(timestamp)).getHours();

      const weatherPostOptions = {
        method: 'POST',
        uri: `${process.env.ROOT_URL}/api/v1/post/weather`,
        body: {
          timestamp,
          weather: sampleWeather
        },
        json: true
      };

      await request(weatherPostOptions)
        .then(res => {
          result = res;
        })
        .catch(err => {
          console.error(err.error);
        });

      expect(result.hours[hour].name).to.not.equal(null);
    });
  });

  describe('Stations Post', function() {
    it('should receive a report of number of stations updated.', async () => {
      let result = {};
      const timestamp = (new Date()).toISOString();
      const resPattern = /Saved and\/or updated \d* stations/;
      const bikesPostOptions = {
        method: 'POST',
        uri: `${process.env.ROOT_URL}/api/v1/post/bikes`,
        body: {
          timestamp,
          stations: sampleStations.features
        },
        json: true
      };

      await request(bikesPostOptions)
        .then(res => {
          result = res;
        })
        .catch(err => {
          result = err;
        });

      expect(result).to.match(resPattern);
    }).timeout(120000); // Extra time for 127 saves. Updating will be faster.

    it('should have data on the docs for the hour sent.', async () => {
      const stations = sampleStations.features;
      // Get a random station index from the dump.
      const station = stations[Math.floor(Math.random() * stations.length)];
      const kioskId = station.properties.kioskId;
      const timestamp = (new Date()).toISOString();
      const datestamp = moment(timestamp).tz("America/New_York").format('YYYY-MM-DD');
      const hour = (new Date(timestamp)).getHours();
      const docId = `${kioskId}~${datestamp}`;
      // Grab random station day document.
      const saved = await StationDay.findOne({ _id: docId });

      expect(saved.hours[hour].properties.kioskId).to.equal(kioskId);
    });
  });

  // After all tests are finished drop database and close connection
  after(function(done) {
    server.close();
    mongoose.connection.db.dropDatabase(function () {
      console.log('👋 Test database dropped and disconnected.');
      mongoose.connection.close(done);
    });
  });
});
