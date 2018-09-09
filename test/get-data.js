const mongoose = require('mongoose');
const request = require('request-promise');
const {expect} = require('chai');
const sampleWeather = require('../sample-data/weather-dump.json');

require('dotenv').config({ path: `${__dirname}/../variables.env` });

const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather';
// const bikesUrl = 'https://www.rideindego.com/stations/json';

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
    mongoose.connect('mongodb://localhost/post-test', { useNewUrlParser: true });
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

  describe('Weather Post', function() {
    it('should receive a document with _id back of the date.', async () => {
      let result = {};
      const timestamp = (new Date()).toISOString();
      // const hour = (new Date(timestamp)).getHours();
      const datestamp = timestamp.substring(0, timestamp.indexOf('T'));

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

      expect(result._id).to.equal(datestamp);
    });

    // it('should have data for the hour when sent.', async () => {
    //   expect(result.hours[hour].name).to.exist();
    // });
  });

  // After all tests are finished drop database and close connection
  after(function(done) {
    mongoose.connection.db.dropDatabase(function () {
      console.log('👋 Test database dropped and disconnected.');
      mongoose.connection.close(done);
    });
  });
});

// describe('Stations Post', function() {
//   it('should receive a report of number of stations updated.', async () => {
//     expect(typeof result).to.equal('string'); // Or use regex
//   });
//
//   it('should have data on the docs for the hour sent.', async () => {
//     // Mongo query for a random doc.
//     expect(result.hours[hour].timestamp).to.exist();
//   });
// });
