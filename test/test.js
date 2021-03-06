const mongoose = require('mongoose');
const request = require('request-promise');
const chai = require('chai');
chai.use(require('chai-match'));
const expect = chai.expect;
require('../server/models/StationDay');
require('../server/models/Weather');
require('../server/models/Cache');
const sampleWeather = require('../server/sample-data/weather-dump.json');
const sampleStations = require('../server/sample-data/indego-dump.json');
const { stationsChecker } = require('../scripts/get-data');
const express = require('express');
const routes = require('../server/routes/index');
const bodyParser = require('body-parser');
const app = express();
let server;

require('dotenv').config();

const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather';

describe('Open Weather', function() {
  // NOTE: Probably unnecessary now.
  it('should receive a response from the weather API with key.', async () => {
    // Allow for running other tests offline
    if (process.env.OFFLINE_TEST) {
      expect(process.env.OFFLINE_TEST).to.equal('true');
      return;
    }
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
    it('should receive a 201 response.', async () => {
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

      expect(result.status).to.equal(201);
    });
  });

  describe('Stations Post', function() {
    let cacheId = '';

    it('should initially receive a 202 response.', async () => {
      let result = {};
      const timestamp = (new Date()).toISOString();

      const stationsPostOptions = {
        method: 'POST',
        uri: `${process.env.ROOT_URL}/api/v1/post/stations`,
        body: {
          timestamp,
          stations: sampleStations.features
        },
        json: true
      };

      await request(stationsPostOptions)
        .then(res => {
          result = res;
          cacheId = result.cacheId;
        })
        .catch(err => {
          console.error(err.error);
        });

      expect(result.status).to.equal(202);
    });

    it('should check the cache and eventually receive a 201 response.', async () => {
      let result;
      await stationsChecker({
        cacheId,
        status: 202
      })
        .then(res => {
          result = res;
        })
        .catch(err => {
          console.error(err.error);
        });

      expect(result.status).to.equal(201);
    }).timeout(120000);
  });

  describe('API requests', function () {
    before((done) => {
      const exec = require('child_process').exec;
      // Load dump from 2018-09-21
      const command = 'mongorestore -h localhost -d post_test --drop ./server/sample-data/indego';
      exec(command, (err, stdout, stderr) => {
        if (err) {
          return done(err);
        }

        done();
      });
    });

    it('should return one weather and station object.', async () => {
      const station = 3122;
      const time = '2018-09-20T01:00';
      const getOptions = {
        method: 'GET',
        uri: `${process.env.ROOT_URL}/api/v1/stations/${station}?at=${time}`,
        json: true
      };
      const result = await request(getOptions)
        .catch(err => {
          console.error(err.errors);
        });

      expect(result.statusCode).to.equal(200);
      expect(result.weather.cod).to.equal(200);
      expect(result.station.properties.kioskId).to.equal(station);
    });

    it('should return one weather and multple stations.', async () => {
      const time = '2018-09-20T08:00';
      const getOptions = {
        method: 'GET',
        uri: `${process.env.ROOT_URL}/api/v1/stations?at=${time}`,
        json: true
      };
      const result = await request(getOptions)
        .catch(err => {
          console.error(err.errors);
        });

      expect(result.statusCode).to.equal(200);
      expect(result.weather.cod).to.equal(200);
      expect(result.stations).to.have.lengthOf(129);
    });

    it('should return an array of 24 weather and station objects.', async () => {
      const station = 3122;
      const startTime = '2018-09-20T00:00';
      const endTime = '2018-09-21T00:00';
      const getOptions = {
        method: 'GET',
        uri: `${process.env.ROOT_URL}/api/v1/stations/${station}?from=${startTime}&to=${endTime}`,
        json: true
      };
      const result = await request(getOptions)
        .catch(err => {
          console.error(err.errors);
        });

      expect(result.statusCode).to.equal(200);
      expect(result.data).to.have.lengthOf(24);
    });

    it('should return an array of 2 weather and station objects.', async () => {
      const station = 3122;
      const startTime = '2018-09-19T00:00';
      const endTime = '2018-09-21T00:00';
      const getOptions = {
        method: 'GET',
        uri: `${process.env.ROOT_URL}/api/v1/stations/${station}?from=${startTime}&to=${endTime}&frequency=daily`,
        json: true
      };
      const result = await request(getOptions)
        .catch(err => {
          console.error(err.errors);
        });

      expect(result.statusCode).to.equal(200);
      expect(result.data).to.have.lengthOf(2);
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
