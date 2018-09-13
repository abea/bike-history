/* eslint-disable no-console */
const mongoose = require('mongoose');
const StationDay = mongoose.model('StationDay');
const moment = require('moment-timezone');
let processing = false;
let resMessage = 'Stations saving...';
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
      processing = false;
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
    console.log(`Adding #${finishedCount}, ${data.docId}, ${processing}`);
    return saveNew(data);
  } else {
    finishedCount++;
    console.log(`Updating #${finishedCount}, ${data.docId}, ${processing}`);
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

const collectPromises = data => {
  return new Promise((resolve, reject) => {
    const promises = data.array.map((station, index) => {
      return processStation({
        station,
        dayStamp: data.dayStamp,
        timestamp: data.timestamp
      });
    });

    resolve(promises);
  });
};

exports.saveStations = async (req, res) => {
  const stations = req.body.stations;
  const timestamp = req.body.timestamp;
  const dayStamp = moment(timestamp).tz("America/New_York").format('YYYY-MM-DD');
  processing = true;
  console.log('processing = true;');
  finishedCount = 0;

  res.status(202).send({
    status: 202,
    message: resMessage
  });

  const bikePromises = await collectPromises({
    array: stations,
    dayStamp,
    timestamp
  });

  const stationData = await Promise.all(bikePromises);

  processing = false;
  console.log('processing = false;');
  resMessage = `Saved and/or updated ${stationData.length} stations`;
};

exports.getStatus = (req, res) => {
  console.log('getStatus');
  if (processing) {
    return res.status(202).send({
      status: 202,
      message: resMessage
    });
  } else {
    return res.status(201).send({
      status: 201,
      message: resMessage
    });
  }
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
