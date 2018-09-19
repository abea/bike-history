const moment = require('moment-timezone');

function pullSnapshots(data, options) {
  const hours = {};

  data.forEach((day, i) => {
    if (options.freq === 'daily') {
      pushSnapshot(day, 12);
    } else {
      for (const hour in day.hours) {
        pushSnapshot(day, hour);
      }
    }
  });

  return hours;

  function pushSnapshot (day, hour) {
    const time = day.hours[hour].timestamp;

    // Skip if there's no data or if the hour is outside the query.
    if (!time || time > options.toTime || time < options.fromTime) { return; }

    // NOTE: `toJSON()` avoids exposing internal document properties if/when
    // delivered via res.json.
    hours[time] = Object.assign({}, day.hours[hour].toJSON());
    // Timestamp is not from the original snapshot.
    delete hours[time].timestamp;
  }
}

function estToUtc(time) {
  return moment.tz(time, 'America/New_York').toISOString();
}

function hourFromTimestamp (time) { return (new Date(time)).getHours(); }

function dateFromTimestamp (time) {
  return time.substring(0, time.indexOf('T'));
}

module.exports = {
  pullSnapshots,
  estToUtc,
  hourFromTimestamp,
  dateFromTimestamp
};
