const moment = require('moment-timezone');

exports.returnResults = (req, res) => {
  const results = {};

  if (req.at && req.weather) {
    // Look for either req.station or req.stations
    results.at = utcToEst(req.at);
    results.weather = req.weather;

    if (req.station && Object.keys(req.station).length > 0) {
      results.station = req.station;
    } else if (req.stations && req.stations.length > 0) {
      results.stations = req.stations;
    } else {
      delete results.weather;
      req.statusCode = 202;
      req.message = 'No station data available.';
    }
  } else if (req.weathers && req.stationHours) {
    results.data = [];

    for (const time in req.weathers) {
      results.data.push({
        at: utcToEst(time),
        weather: req.weathers[time],
        station: req.stationHours[time]
      });
    }

    if (results.data.length === 0) {
      req.statusCode = 202;
    }
  }

  results.statusCode = req.statusCode ? req.statusCode : 200;

  if (req.errors) {
    results.errors = req.errors;
  }

  res.json(results);
};

function utcToEst(time) {
  return moment.tz(time, 'America/New_York').format();
}
