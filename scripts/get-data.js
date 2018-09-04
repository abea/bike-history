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
      // - Add the timestamp to the weather results.
      weather.timestamp = timestamp;
      return weather;
    })
    .catch(err => {
      return {error: err};
    });
}

async function init () {
  const weather = await getWeather();

  console.log(weather);
}

init();

// - Post the weather snapshot, with timestamp, to the weather route.
//
// - Get stations snapshot
//   - Add the timestamp to the station data object.
// - Post the stations, with the timestamp, to the stations route.
//
