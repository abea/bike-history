const moment = require('moment-timezone');

exports.returnResults = (req, res) => {
  const results = {};
  if (req.at && req.weather) {
    // Look for either req.station or req.stations
    results.at = utcToEst(req.at);
    results.weather = req.weather;
    if (req.station) {
      results.station = req.station;
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
// Enveloped:
// {
//   data: [
//     { ... },
//     { ... },
//     // ...
//   ]
// }
