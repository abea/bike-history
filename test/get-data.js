const request = require('request-promise');
const {expect} = require('chai');
require('dotenv').config({ path: `${__dirname}/../variables.env` });

const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather';
const bikesUrl = 'https://www.rideindego.com/stations/json';

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

describe('Weather Post', function() {
  it('should receive a document with _id back from post request.', async () => {
    expect(result._id).to.exist();
  });

  it('should have data for the hour when sent.', async () => {
    expect(result.hours[hour].name).to.exist();
  });

});

describe('Stations Post', function() {
  it('should receive a report of number of stations updated.', async () => {
    expect(typeof result).to.equal('string'); // Or use regex
  });

  it('should have data on the docs for the hour sent.', async () => {
    // Mongo query for a random doc.
    expect(result.hours[hour].timestamp).to.exist();
  });
});
