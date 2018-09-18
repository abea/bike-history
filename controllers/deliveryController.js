const moment = require('moment-timezone');

exports.returnResults = (req, res) => {
  const results = {};
  if (req.at && req.weather) {
    // Look for either req.station or req.stations
    results.at = utcToEst(req.at);
    results.weather = req.weather;
    if (req.station) {
      results.station = req.station;
    } else if (req.stations) {
      results.stations = req.stations;
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
  }

  if (req.errors) {
    results.errors = req.errors;
  }

  res.json(results);
};

function utcToEst(time) {
  return moment.tz(time, 'America/New_York').format();
}
