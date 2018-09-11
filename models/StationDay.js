const mongoose = require('mongoose');

const stationFields = {
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
  properties: {
    bikesAvailable: Number,
    docksAvailable: Number,
    totalDocks: Number,
    trikesAvailable: Number,
    classicBikesAvailable: Number,
    smartBikesAvailable: Number,
    electricBikesAvailable: Number,
    addressStreet: String,
    addressCity: String,
    addressState: String,
    addressZipCode: String,
    closeTime: String,
    eventEnd: String, // Purpose unclear.
    eventStart: String, // Purpose unclear.
    isEventBased: Boolean, // Purpose unclear.
    isVirtual: Boolean, // Purpose unclear.
    isVisible: Boolean, // Purpose unclear.
    kioskId: Number,
    kioskPublicStatus: String,
    kioskStatus: String,
    name: String,
    notes: String,
    openTime: String,
    publicText: String,
    timeZone: String,
    kioskConnectionStatus: String,
    kioskType: Number,
    latitude: Number,
    longitude: Number,
    hasGeofence: Boolean
  }
};

const hoursInDay = [...Array(24).keys()];
const hoursObject = {};

// Place all station fields on each hour to maintain complete data snapshot.
for (const hour of hoursInDay) { hoursObject[hour] = stationFields; }

const schemaObj = Object.assign({
  _id: String,
  timestamp: String,
  kioskId: Number,
  hours: hoursObject
});

// Station statuses to be collected in documents by day.
const stationDaySchema = new mongoose.Schema(schemaObj);

module.exports = mongoose.model('StationDay', stationDaySchema);
