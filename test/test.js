const mongoose = require('mongoose');
const request = require('request-promise');
const chai = require('chai');
chai.use(require('chai-match'));
const expect = chai.expect;
require('../models/StationDay');
require('../models/Weather');
require('../models/Cache');
const sampleWeather = require('../sample-data/weather-dump.json');
// const sampleStations = require('../sample-data/indego-dump.json');
const express = require('express');
const routes = require('../routes/index');
const bodyParser = require('body-parser');
const app = express();
// const moment = require('moment-timezone');
let server;

require('dotenv').config({ path: `${__dirname}/../variables.env` });

const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather';

describe('Open Weather', function() {
  // NOTE: Probably unnecessary now.
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
    it('should receive a 200 response.', async () => {
      let result = {};
      const timestamp = (new Date()).toISOString();

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

      expect(result).to.equal('OK');
    });

    // it('should have data for the hour when sent.', async () => {
    //   let result = {};
    //   const timestamp = (new Date()).toISOString();
    //   const hour = (new Date(timestamp)).getHours();
    //
    //   const weatherPostOptions = {
    //     method: 'POST',
    //     uri: `${process.env.ROOT_URL}/api/v1/post/weather`,
    //     body: {
    //       timestamp,
    //       weather: sampleWeather
    //     },
    //     json: true
    //   };
    //
    //   await request(weatherPostOptions)
    //     .then(res => {
    //       result = res;
    //     })
    //     .catch(err => {
    //       console.error(err.error);
    //     });
    //
    //   expect(result.hours[hour].name).to.not.equal(null);
    // });
  });

  // describe('Cache route', function() {
  //   it('should receive a report of number of stations updated if complete', async () => {
  //     const resPattern = /Saved and\/or updated \d* stations/;
  //     function getRandomInt(max) {
  //       return Math.floor(Math.random() * Math.floor(max));
  //     };
  //     let random = getRandomInt(10000000000).toString();
  //
  //     await (new Cache({
  //       _id: random,
  //       count: 42
  //     })).save();
  //
  //     const cacheCheckOptions = {
  //       uri: `${process.env.ROOT_URL}/api/v1/get/bike-processing/${random}`,
  //       method: 'GET',
  //       json: true
  //     };
  //
  //     const cacheCheck = await request(cacheCheckOptions);
  //     expect(cacheCheck.message).to.match(resPattern);
  //   });
  //
  //   it('should have data on the docs for the hour sent.', async () => {
  //     const stations = sampleStations.features;
  //     // Get a random station index from the dump.
  //     const station = stations[Math.floor(Math.random() * stations.length)];
  //     const kioskId = station.properties.kioskId;
  //     const timestamp = (new Date()).toISOString();
  //     const datestamp = moment(timestamp).tz("America/New_York").format('YYYY-MM-DD');
  //     const hour = (new Date(timestamp)).getHours();
  //     const docId = `${kioskId}~${datestamp}`;
  //     // Grab random station day document.
  //     const saved = await StationDay.findOne({ _id: docId });
  //
  //     expect(saved.hours[hour].properties.kioskId).to.equal(kioskId);
  //   });
  // });

  // After all tests are finished drop database and close connection
  after(function(done) {
    server.close();
    mongoose.connection.db.dropDatabase(function () {
      console.log('👋 Test database dropped and disconnected.');
      mongoose.connection.close(done);
    });
  });
});
