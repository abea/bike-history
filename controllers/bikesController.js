const mongoose = require('mongoose');
const StationDay = mongoose.model('StationDay');
const Cache = mongoose.model('Cache');
const uuid = require('uuid/v4');
const moment = require('moment-timezone');
let savingMessage = 'Stations saving...';
let finishedCount = 0; // TODO: Remove this and the logs once in production.

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
      return err;
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
    console.info(`Adding #${finishedCount}, ${data.docId}`);
    return saveNew(data);
  } else {
    finishedCount++;
    console.info(`Updating #${finishedCount}, ${data.docId}`);
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
  const cache = await (new Cache({ _id: uuid() })).save();
  const cacheId = cache._id;

  finishedCount = 0;

  res.status(202).send({
    status: 202,
    message: savingMessage,
    cacheId
  });

  const bikePromises = await collectPromises({
    array: stations,
    dayStamp,
    timestamp
  });

  const stationData = await Promise.all(bikePromises);

  await Cache.findOneAndUpdate(
    { _id: cacheId },
    {
      $set: { count: stationData.length }
    }
  );
};

exports.getStatus = async (req, res) => {
  const cacheId = req.params.cacheId;

  const completed = await Cache.findOne({_id: cacheId});

  if (completed.count) {
    res.status(201).send({
      status: 201,
      message: `Saved and/or updated ${completed.count} stations`
    });
  } else {
    res.status(202).send({
      status: 202,
      message: savingMessage
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
