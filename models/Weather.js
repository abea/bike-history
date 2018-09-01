const mongoose = require('mongoose');

const weatherFields = {
  geometry: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number
    }]
  },
  weather: [
    {
      id: Number,
      main: String,
      description: String,
      icon: String
    }
  ],
  base: String,
  main: {
    temp: Number,
    pressure: Number,
    humidity: Number,
    temp_min: Number,
    temp_max: Number
  },
  visibility: Number,
  wind: {
    speed: Number,
    deg: Number
  },
  rain: {
    '1h': Number
  },
  clouds: {
    all: Number
  },
  dt: Number,
  sys: {
    type: Number,
    id: Number,
    message: Number,
    country: String,
    sunrise: Number,
    sunset: Number
  },
  id: Number,
  name: String,
  cod: Number
};

const hoursInDay = [...Array(24).keys()];
const hoursObject = {};

// Place all station fields on each hour to maintain complete data snapshot.
for (const hour of hoursInDay) { hoursObject[hour] = weatherFields; }

const schemaObj = Object.assign({
  _id: String,
  hours: hoursObject
});

// Station statuses to be collected in documents by day.
const weatherSchema = new mongoose.Schema(schemaObj);

module.exports = mongoose.model('Weather', weatherSchema);
