const request = require('request-promise');
require('dotenv').config({ path: `${__dirname}/../variables.env` });

const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_KEY}&id=${process.env.WEATHER_CITY_ID}`;
const bikesUrl = 'https://www.rideindego.com/stations/json';
// const bikesTest = `${process.env.ROOT_URL}/api/v1/get/sample-bikes`;

// - Set timestamp
const timestamp = (new Date()).toISOString();

// - Get weather snapshot
function getWeather () {
  return request({
    uri: weatherUrl,
    method: 'GET',
    json: true
  })
    .then(weather => {
      return weather;
    })
    .catch(err => {
      return {error: err};
    });
}

function getBikes () {
  return request({
    uri: bikesUrl,
    method: 'GET',
    json: true
  })
    .then(data => {
      return data.features;
    })
    .catch(err => {
      return {error: err};
    });
}

async function init () {
  const weather = await getWeather();
  const stations = await getBikes();

  const weatherPostOptions = {
    method: 'POST',
    uri: `${process.env.ROOT_URL}/api/v1/post/weather`,
    body: {
      timestamp,
      weather
    },
    json: true
  };

  // - Post the weather snapshot, with timestamp, to the weather route.
  await request(weatherPostOptions)
    .then(res => {
      if (!res) {
        throw Error('No document returned from weather post request.');
      }
      return null;
    })
    .catch(err => {
      console.error('🚫⛈', err.error);
    });

  const bikesPostOptions = {
    method: 'POST',
    uri: `${process.env.ROOT_URL}/api/v1/post/bikes`,
    body: {
      timestamp,
      stations
    },
    json: true
  };

  // - Post the stations snapshot, with timestamp, to the stations route.
  await request(bikesPostOptions)
    .then(res => {
      if (!res) {
        throw Error('No document returned from bikes post request.');
      }
      console.log('🚲', res);
      return null;
    })
    .catch(err => {
      console.error('🚫🚲', err.error);
    });
}

init();
