const request = require('request-promise');
require('dotenv').config({ path: `${__dirname}/../variables.env` });

const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_KEY}&id=${process.env.WEATHER_CITY_ID}`;

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

async function init () {
  const weather = await getWeather();

  const weatherPostOptions = {
    method: 'POST',
    uri: `${process.env.ROOT_URL}/api/v1/post/weather`,
    body: {
      timestamp,
      weather
    }
  };

  request(weatherPostOptions)
    .then(res => {
      console.log('👍', Object.keys(res));
      return null;
    })
    .catch(err => {
      console.error('🚫', err.error);
    });
}

init();

// - Post the weather snapshot, with timestamp, to the weather route.
//
// - Get stations snapshot
//   - Add the timestamp to the station data object.
// - Post the stations, with the timestamp, to the stations route.
//
