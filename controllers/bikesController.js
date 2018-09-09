const mongoose = require('mongoose');
const StationDay = mongoose.model('StationDay');
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
  data.hour = (new Date(data.timestamp)).getHours();
  if (data.noDoc) {
    finishedCount++;
    console.log(`Saving #${finishedCount}, ${data.docId}`);
    return saveNew(data);
  } else {
    finishedCount++;
    console.log(`Updating #${finishedCount}, ${data.docId}`);
    return updateOld(data);
  }
};

const saveNew = function (data) {
  console.log('Making new doc', data.docId);
  const hoursInDay = [...Array(24).keys()];
  const newData = {};

  newData._id = data.docId;
  newData.hours = {};

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
  const dayStamp = timestamp.substring(0, timestamp.indexOf('T'));
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

  res.send(`saved/updated ${stationData.length} stations`);
};

const emptyStationDay = {
  geometry: {
    coordinates: [null, null]
  },
  properties: {
    timestamp: null,
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
