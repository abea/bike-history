const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  geometry: {
    type: 'Point',
    coordinates: [{
      type: Number
    }]
  },
  addressStreet: String,
  addressCity: String,
  addressState: String,
  addressZipCode: String,
  closeTime: String,
  kioskId: Number,
  name: String,
  publicText: String,
  totalDocks: Number,
  days: [{
    timestamp: Date,
    docksAvailable: Number,
    bikesAvailable: Number,
    classicBikesAvailable: Number,
    smartBikesAvailable: Number,
    electricBikesAvailable: Number,
    trikesAvailable: Number,
    hours: [{
      timestamp: Date,
      docksAvailable: Number,
      bikesAvailable: Number,
      classicBikesAvailable: Number,
      smartBikesAvailable: Number,
      electricBikesAvailable: Number,
      trikesAvailable: Number
    }]
  }]
});

module.exports = mongoose.model('Station', stationSchema);
