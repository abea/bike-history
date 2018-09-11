const mongoose = require('mongoose');
const StationDay = mongoose.model('StationDay');
const moment = require('moment-timezone');
let finishedCount = 0;

const processStation = function (data) {
  const station = data.station;
  const stationId = station.properties.kioskId;
  const docId = `${stationId}~${data.dayStamp}`;

  const input = {
    station,
    stationId,
    docId,
    dayStamp: data.dayStamp
  };

  return findStationDay(input)
    .then(foundStation => {
      return {
        docId,
        station,
        timestamp: data.timestamp,
        dayStamp: data.dayStamp,
        noDoc: !foundStation
      };
    })
    .then(saveStationDay)
    .catch(err => {
      console.error('⚙️', err);
    });
};

const findStationDay = async function (data) {
  const station = data.station;
  const stationId = station.properties.kioskId;
  const docId = `${stationId}~${data.dayStamp}`;

  const savedStation = await StationDay.findOne({
    _id: docId
  });

  // Returns null if no existing document.
  return savedStation;
};

const saveStationDay = async function (data) {
  data.hour = moment(data.timestamp).tz("America/New_York").hours();
  data.station.timestamp = data.timestamp;

  if (data.noDoc) {
    finishedCount++;
    console.log(`Adding #${finishedCount}, ${data.docId}`);
    return saveNew(data);
  } else {
    finishedCount++;
    console.log(`Updating #${finishedCount}, ${data.docId}`);
    return updateOld(data);
  }
};

const saveNew = function (data) {
  const newData = {};

  newData._id = data.docId;
  newData.kioskId = data.station.properties.kioskId;
  // Record the day's timestamp as the ISO String of the first recorded data
  // that day.
  newData.timestamp = data.timestamp;
  newData.hours = {};

  const hoursInDay = [...Array(24).keys()];
  for (const hour of hoursInDay) { newData.hours[hour] = emptyStationDay; }

  newData.hours[data.hour] = data.station;

  const newDay = new StationDay(newData);
  return newDay.save();
};

const updateOld = function (data) {
  const field = `hours.${data.hour}`;

  return StationDay.findOneAndUpdate(
    {
      _id: data.docId
    },
    {
      $set: {
        [field]: data.station
      }
    },
    {
      returnNewDocument: true
    }
  );
};

exports.saveStations = async (req, res) => {
  const stations = req.body.stations;
  const timestamp = req.body.timestamp;
  const dayStamp = moment(timestamp).tz("America/New_York").format('YYYY-MM-DD');
  finishedCount = 0;

  const bikePromises = await stations.map(async station => {
    const stationPromise = await processStation({
      station,
      dayStamp,
      timestamp
    });

    return stationPromise;
  });

  const stationData = await Promise.all(bikePromises);

  res.send(`Saved and/or updated ${stationData.length} stations`);
};

const emptyStationDay = {
  timestamp: null,
  geometry: {
    coordinates: [null, null]
  },
  properties: {
    bikesAvailable: null,
    docksAvailable: null,
    totalDocks: null,
    trikesAvailable: null,
    classicBikesAvailable: null,
    smartBikesAvailable: null,
    electricBikesAvailable: null,
    addressStreet: null,
    addressCity: null,
    addressState: null,
    addressZipCode: null,
    closeTime: null,
    eventEnd: null,
    eventStart: null,
    isEventBased: null,
    isVirtual: null,
    isVisible: null,
    kioskId: null,
    kioskPublicStatus: null,
    kioskStatus: null,
    name: null,
    notes: null,
    openTime: null,
    publicText: null,
    timeZone: null,
    kioskConnectionStatus: null,
    kioskType: null,
    latitude: null,
    longitude: null,
    hasGeofence: null
  }
};
