/* eslint-disable no-console */
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
  console.log('checkBikes');
  return request({
    uri: `${process.env.ROOT_URL}/api/v1/get/bike-processing`,
    method: 'GET',
    json: true,
    timeout: 4000
  })
    .catch(err => {
      if (err.error.code === 'ESOCKETTIMEDOUT') {
        console.log('checkBikes request timeout.');
        return {
          status: 202,
          message: 'checkBikes request timeout. Check again.'
        };
      }

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
  // let bikesFinished = false;
  // - Post the stations snapshot, with timestamp, to the stations route.
  await request(bikesPostOptions)
    .then(res => {
      if (!res) {
        throw Error('No result returned from bikes post request.');
      }
      console.log('🚲', res);

      return res;
    })
    .then(async status => {
      return new Promise((resolve, reject) => {
        if (status.status === 201) {
          return resolve(status);
        }

        let checks = 0;

        const checkIt = function() {
          console.log('checkIt');
          checks++;
          console.log('checking', checks);
          checkBikes()
            .then(res => {
              console.log('checkBikes THEN');
              if (res.status === 201 || checks > 24) {
                console.log('check finished', checks);
                status = res;
                resolve(status);
              } else {
                console.log('🚲', res);
                setTimeout(checkIt, 10000);
              }
            })
            .catch(err => reject(err));
        };

        checkIt();
      });
    })
    .then(status => {
      console.log('🏁', status);
    })
    .catch(err => {
      err = err.error ? err.error : err;
      console.error('🚫🚲', err);
    });
}

module.exports = init;
