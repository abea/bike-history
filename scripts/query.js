const mongoose = require('mongoose');
// import all of our models - they need to be imported only once
// const StationDay = require('../models/StationDay');
// const Weather = require('../models/Weather');

require('dotenv').config({ path: `${__dirname}/../variables.env` });

mongoose.connect(process.env.DATABASE);

// - Set timestamp
// - Get weather snapshot
//   - Add the timestamp to the weather results.
//   - If the first hour of the day, create document for the entire day,
//     populating the first hour.
//   - Otherwise update the day's document for the hour.
//
// - Get stations snapshots
//   - Async series over the stations in the results.
//   - If there's a document for that station and day, update the StationDay
//     document with the hour's snapshot.
//   - If not, create a document for the station and day, adding empty objects
//     for the other hours in the day and populate the first hour, including the
//     saved timestamp.

function updateSnapshots () {
  const now = new Date();
  const timestamp = now.toISOString();
  console.log(timestamp);
}

updateSnapshots();
