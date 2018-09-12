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

function checkBikes () {
  return request({
    uri: `${process.env.ROOT_URL}/api/v1/get/bike-processing`,
    method: 'GET',
    json: true
  })
    .then(res => {
      return res;
    })
    .catch(err => {
      console.error('🤸‍', err);
      return err;
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
      if (!res._id) {
        throw Error('No document returned from weather post request.');
      }
      console.log('⛈');
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
  let bikesFinished = false;
  // - Post the stations snapshot, with timestamp, to the stations route.
  await request(bikesPostOptions)
    .then(res => {
      if (!res) {
        throw Error('No result returned from bikes post request.');
      }
      console.log('🚲', res);

      if (res.status === 201) {
        bikesFinished = true;
      }

      return bikesFinished;
    })
    .then(async finished => {
      let checks = 0;
      let status = {};

      const checkAgain = async function() {
        console.log('checking', checks);
        checks++;
        status = await checkBikes();

        if (status.status === 201) {
          finished = true;
          console.log('🚲', status.message);
          return null;
        } else {
          console.log('🎿', status);
        }

        if (!finished && checks < 24) {
          setTimeout(async () => {
            await checkAgain();
          }, 5000);
        }
      };

      await checkAgain();

      if (!finished) {
        throw Error('Bike post timed out.');
      }
    })
    .catch(err => {
      err = err.error ? err.error : err;
      console.error('🚫🚲', err);
    });
}

module.exports = init;
