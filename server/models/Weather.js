const mongoose = require('mongoose');

const weatherFields = {
  timestamp: String,
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
    // Extra layer to indicate this isn't the "type" of `sys`
    type: { type: Number },
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
  _id: String, // String format of the date in ISO date format.
  timestamp: String, // TODO Should have named this as createdAt
  updatedAt: String,
  hours: hoursObject
});

// Station statuses to be collected in documents by day.
const weatherSchema = new mongoose.Schema(schemaObj);

module.exports = mongoose.model('Weather', weatherSchema);
