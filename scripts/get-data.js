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
    json: true,
    timeout: 4000
  })
    .catch(err => {
      if (err.error.code === 'ESOCKETTIMEDOUT') {
        return {
          status: 202,
          message: 'checkBikes request timeout. Check again.'
        };
      }

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
      console.info('🚲', res.message);

      return res;
    })
    .then(async status => {
      return new Promise((resolve, reject) => {
        if (status.status === 201) {
          return resolve(status);
        }

        let checks = 0;

        const checkIt = function() {
          checks++;

          checkBikes()
            .then(res => {
              if (res.status === 201) {
                resolve(res);
              } else if (checks > 15) {
                status = {
                  status: 408,
                  message: 'Station processing timeout.'
                };
                resolve(status);
              } else {
                console.info('🚲', res.message);
                setTimeout(checkIt, 10000);
              }
            })
            .catch(err => reject(err));
        };

        checkIt();
      });
    })
    .then(status => {
      if (status.status === 408) {
        console.error('🚫', status.message);
      } else {
        console.info('🏁', status.message);
      }
    })
    .catch(err => {
      err = err.error ? err.error : err;
      console.error('🚫🚲', err);
    });
}

module.exports = init;
