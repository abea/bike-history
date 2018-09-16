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
  const at = req.query.at;
  const from = req.query.from;
  const to = req.query.to;
  if (at) {
    const query = {
      timestamp: at,
      date: dateFromTimestamp(at),
      hour: hourFromTimestamp(at)
    };

    data = await getWeatherAt(query);
    req.weather = data.weather;
    req.at = data.timestamp;
  } else if (from && to && (to > from)) {
    const fromDate = dateFromTimestamp(from);
    const toDate = dateFromTimestamp(to);

    const weatherDays = await Weather.find({
      $and: [
        {timestamp: {$gte: fromDate}},
        {timestamp: {$lte: toDate}}
      ]
    });

    data = weatherDays;
    // Get all the documents within the timestamps. Returned: array of documents with hours objects.
    // Identify hours to get in each day. `forEach` over the returned docs and push each weather into an object with timestamp into an array to add to req.
  } else {
    // TODO: Return a response code indicating poorly formed request.
  }

  res.json(data);
};

function dateFromTimestamp (time) { return time.substring(0, time.indexOf('T')); }
function hourFromTimestamp (time) { return (new Date(time)).getHours(); }

async function getWeatherAt (q) {
  const hourProp = `hours.${q.hour}`;
  const snapshot = await Weather.findOne({_id: q.date}, {
    [hourProp]: 1
  });

  let weather = Object.assign({}, snapshot.hours[q.hour]);
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
