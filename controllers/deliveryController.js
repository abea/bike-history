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
  }

  if (req.errors) {
    results.errors = req.errors;
  }

  res.json(results);
};

function utcToEst(time) {
  return moment.tz(time, 'America/New_York').format();
}
// This API should respond as follows, with the actual time of the first snapshot of data on or after the requested time and the data:
//
// ```javascript
// {
//   at: '2017-11-01:T11:00:01',
//   weather: { /* as per the Open Weather Map API response for Philadelphia */ },
//   stations: { /* As per the Indego API */ }
// }
// ```

// Enveloped:
// {
//   data: [
//     { ... },
//     { ... },
//     // ...
//   ]
// }
