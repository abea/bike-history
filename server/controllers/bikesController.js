const mongoose = require('mongoose');
const StationDay = mongoose.model('StationDay');
const Cache = mongoose.model('Cache');
const uuid = require('uuid/v4');
const moment = require('moment-timezone');
const h = require('../helpers');
let savingMessage = 'Stations saving...';
let finishedCount = 0; // TODO: Add verbose flag to activate this logging.

exports.saveStations = async (req, res) => {
  const stations = req.body.stations;
  const timestamp = req.body.timestamp;
  const dayStamp = moment(timestamp)
    .tz('America/New_York')
    .format('YYYY-MM-DD');
  const cache = await new Cache({ _id: uuid() }).save();
  const cacheId = cache._id;

  finishedCount = 0;

  res.status(202).send({
    status: 202,
    message: savingMessage,
    cacheId
  });

  const stationData = await Promise.all(
    stations.map(station => {
      return processStation({
        station,
        dayStamp,
        timestamp
      });
    })
  );

  await Cache.findOneAndUpdate(
    { _id: cacheId },
    {
      $set: { count: stationData.length }
    }
  );
};

exports.getPostStatus = async (req, res) => {
  const cacheId = req.params.cacheId;

  const completed = await Cache.findOne({ _id: cacheId });

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

exports.returnStations = async (req, res, next) => {
  const at = req.query.at;
  const from = req.query.from;
  const to = req.query.to;
  const kiosk = req.params.kioskId;

  if (at) {
    const snapshots = await getStationsAt({
      at,
      kiosk
    });

    req.station = snapshots.station;
    req.stations = snapshots.stations;
  } else if (kiosk && to > from) {
    const fromTime = h.estToUtc(from);
    const toTime = h.estToUtc(to);
    const freq = req.query.frequency === 'daily' ? 'daily' : 'hourly';
    // Get documents it's possible we might need.
    const stationDays = await StationDay.find({
      kioskId: kiosk,
      $and: [{ updatedAt: { $gte: fromTime } }, { timestamp: { $lte: toTime } }]
    });

    req.stationHours = h.pullSnapshots(stationDays, {
      fromTime,
      toTime,
      freq
    });
  } else {
    req.errors = req.errors || [];

    req.errors.push({
      code: 422,
      message:
        'Stations query invalid. You must include a date-formatted "at" query string or "from" and "to" query strings (the former being before the latter). If querying a time span, the kiosk ID must be included (e.g., /api/v1/stations/:kioskId?from=[a date]&to=[a date]).'
    });
  }

  next();
};

const processStation = function(data) {
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

const findStationDay = async function(data) {
  const station = data.station;
  const stationId = station.properties.kioskId;
  const docId = `${stationId}~${data.dayStamp}`;

  const savedStation = await StationDay.findOne({
    _id: docId
  });

  // Returns null if no existing document.
  return savedStation;
};

const saveStationDay = async function(data) {
  data.hour = moment(data.timestamp)
    .tz('America/New_York')
    .hours();
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

const saveNew = async function(data) {
  const newData = {};

  newData._id = data.docId;
  newData.kioskId = data.station.properties.kioskId;
  // Record the day's timestamp as the ISO String of the first recorded data
  // that day.
  newData.timestamp = data.timestamp;
  newData.updatedAt = data.timestamp;
  newData.hours = {};

  const hoursInDay = [...Array(24).keys()];
  for (const hour of hoursInDay) {
    newData.hours[hour] = emptyStationDay;
  }

  newData.hours[data.hour] = data.station;

  const newDay = new StationDay(newData);
  await newDay.save();
};

const updateOld = async function(data) {
  const field = `hours.${data.hour}`;

  await StationDay.findOneAndUpdate(
    {
      _id: data.docId
    },
    {
      $set: {
        [field]: data.station,
        updatedAt: data.timestamp
      }
    },
    {
      returnNewDocument: true
    }
  );
};

async function getStationsAt(q) {
  const hour = h.hourFromTimestamp(q.at);
  const hourProp = `hours.${hour}`;
  const day = q.at.substring(0, q.at.indexOf('T'));
  const nextDay = moment(day)
    .add(1, 'day')
    .format('YYYY-MM-DD');
  const result = {};

  const kiosk = q.kiosk;
  let query = {
    $and: [{ timestamp: { $gte: day } }, { timestamp: { $lt: nextDay } }]
  };

  if (kiosk) {
    query.kioskId = kiosk;
  }

  const snapshot = await StationDay.find(query, {
    [hourProp]: 1
  });

  if (kiosk && snapshot.length) {
    result.station = Object.assign({}, snapshot[0].hours[hour].toJSON());
    delete result.station.timestamp; // Not from the original snapshot.
  } else {
    result.stations = snapshot.map(station => {
      station = Object.assign({}, station.hours[hour].toJSON());
      delete station.timestamp; // Not from the original snapshot.
      return station;
    });
  }

  return result;
}

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
