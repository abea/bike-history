const mongoose = require('mongoose');
const Weather = mongoose.model('Weather');
const moment = require('moment-timezone');
const h = require('../helpers');

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
    data.updatedAt = timestamp;
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
        [field]: req.body.weather,
        updatedAt: timestamp
      }
    },
    {
      returnNewDocument: true
    }
  );

  res.send(updated);
};

exports.returnWeather = async (req, res, next) => {
  const at = req.query.at;
  const from = req.query.from;
  const to = req.query.to;

  if (at) {
    const query = {
      timestamp: at,
      date: h.dateFromTimestamp(at),
      hour: h.hourFromTimestamp(at)
    };

    const snapshot = await getWeatherAt(query);
    req.weather = snapshot.weather;
    req.at = snapshot.timestamp;
  } else if (from && to && (to > from)) {
    const fromTime = h.estToUtc(from);
    const toTime = h.estToUtc(to);
    const freq = (req.query.frequency === 'daily') ? 'daily' : 'hourly';

    // Get documents it's possible we might need.
    const weatherDays = await Weather.find({
      $and: [
        {updatedAt: {$gte: fromTime}},
        {timestamp: {$lte: toTime}}
      ]
    });

    req.weathers = h.pullSnapshots(weatherDays, {
      fromTime,
      toTime,
      freq
    });
  } else {
    req.errors = req.errors || [];
    req.errors.push({
      code: 422,
      message: 'Weather query invalid. Check the "at" or "from"/"to" query strings.'
    });
  }

  next();
};

async function getWeatherAt (q) {
  const hourProp = `hours.${q.hour}`;
  const snapshot = await Weather.findOne({_id: q.date}, {
    [hourProp]: 1
  });

  // NOTE: `toJSON()` avoids exposing internal document properties if/when
  // delivered via res.json.
  let weather = Object.assign({}, snapshot.hours[q.hour].toJSON());
  const timestamp = weather.timestamp;
  delete weather.timestamp; // Not from the original snapshot.

  return {weather, timestamp};
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
