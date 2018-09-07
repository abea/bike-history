const mongoose = require('mongoose');
const Weather = mongoose.model('Weather');

exports.prepWeather = (req, res, next) => {
  const data = req.body;

  const weather = data.weather;
  // Get the coordinates into geometry format.
  weather.geometry = {
    coordinates: [weather.coord.lon, weather.coord.lat]
  };
  delete weather.coord;

  // return new weather object (req.body.weather) and timestamp (req.body.timestamp)
  req.body.weather = weather;

  next();
};

exports.saveWeather = async (req, res) => {
  // Check if a document exists for that calendar day.
  const timestamp = req.body.timestamp;
  const dayStamp = timestamp.substring(0, timestamp.indexOf('T'));
  let data = {};
  let weatherDay = await Weather.findOne({
    _id: dayStamp
  });

  // If not, create big ass object with space for each hour.
  if (!weatherDay) {
    // Make an array with values 1-23
    const hoursInDay = [...Array(24).keys()];
    const hour = (new Date(timestamp)).getHours();

    data._id = dayStamp;
    data.hours = {};

    for (const hour of hoursInDay) { data.hours[hour] = emptyWeather; }

    data.hours[hour] = req.body.weather;

    // Then save the new document.
    await (new Weather(data)).save((err, doc) => {
      if (err) {
        for (const key in err.errors) {
          console.error(err.errors[key].message);
        }
      }

      res.send(doc);
    });

    return;
  }

  // TODO If so, get the hour and update the document with the weather at that hour.
  res.send(weatherDay);
};

const emptyWeather = {
  geometry: {
    coordinates: [null, null]
  },
  weather: [
    {
      id: null,
      main: null,
      description: null,
      icon: null
    }
  ],
  base: null,
  main: {
    temp: null,
    pressure: null,
    humidity: null,
    temp_min: null,
    temp_max: null
  },
  visibility: null,
  wind: {
    speed: null,
    deg: null
  },
  rain: {
    '1h': null
  },
  clouds: {
    all: null
  },
  dt: null,
  sys: {
    type: null,
    id: null,
    message: null,
    country: null,
    sunrise: null,
    sunset: null
  },
  id: null,
  name: null,
  cod: null
};
