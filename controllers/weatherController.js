const mongoose = require('mongoose');
const Weather = mongoose.model('Weather');
const moment = require('moment-timezone');

exports.prepWeather = (req, res, next) => {
  const data = req.body;

  const weather = data.weather;
  // Get the coordinates into geometry format.
  weather.geometry = {
    coordinates: [weather.coord.lon, weather.coord.lat]
  };
  delete weather.coord;

  req.body.weather = weather;

  next();
};

exports.saveWeather = async (req, res) => {
  // Check if a document exists for that calendar day.
  const timestamp = req.body.timestamp;
  req.body.weather.timestamp = timestamp;
  const dayStamp = moment(timestamp).tz("America/New_York").format('YYYY-MM-DD');
  const hour = moment(timestamp).tz("America/New_York").hours();

  let data = {};

  let weatherDay = await Weather.findOne({
    _id: dayStamp
  });

  // If not, create big ass object with space for each hour.
  if (!weatherDay) {
    // Make an array with values 1-23
    const hoursInDay = [...Array(24).keys()];

    data._id = dayStamp;
    // Record the day's timestamp as the ISO String of the first recorded data
    // that day.
    data.timestamp = timestamp;
    data.hours = {};

    for (const hour of hoursInDay) { data.hours[hour] = emptyWeather; }

    data.hours[hour] = req.body.weather;

    // Then save the new document.
    await (new Weather(data)).save((err, doc) => {
      if (err) {
        for (const key in err.errors) {
          throw Error(err.errors[key].message);
        }
      }

      res.send(doc);
    });

    return;
  }

  // If so, update the document with the weather at that hour.
  const field = `hours.${hour}`;

  // TODO Why is `updated` being set to the old document when
  // `returnNewDocument: true` is set?
  const updated = await Weather.findOneAndUpdate(
    {
      _id: dayStamp
    },
    {
      $set: {
        [field]: req.body.weather
      }
    },
    {
      returnNewDocument: true
    }
  );

  res.send(updated);
};

exports.returnWeather = async (req, res, next) => {
  let data = {};
  if (req.query.at) {
    const query = dateAndHourFrom(req.query.at);
    query.timestamp = req.query.at;

    data = await getWeatherAt(query);
    req.weather = data;
  }

  res.json(data);
};

function dateAndHourFrom (time) {
  const date = time.substring(0, time.indexOf('T'));
  const hour = (new Date(time)).getHours();

  return { date, hour };
}

async function getWeatherAt (q) {
  const hourProp = `hours.${q.hour}`;
  const snapshot = await Weather.findOne({_id: q.date}, {
    [hourProp]: 1
  });

  let weather = Object.assign({}, snapshot.hours[q.hour]);
  delete weather.timestamp; // Not from the original snapshot.

  return weather;
}

const emptyWeather = {
  timestamp: null,
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
