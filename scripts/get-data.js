const mongoose = require('mongoose');

require('dotenv').config({ path: `${__dirname}/../variables.env` });

mongoose.connect(process.env.DATABASE);

// - Set timestamp
// - Get weather snapshot
//   - Add the timestamp to the weather results.
// - Post the weather snapshot, with timestamp, to the weather route.
//
// - Get stations snapshot
//   - Add the timestamp to the station data object.
// - Post the stations, with the timestamp, to the stations route.

function updateSnapshots () {
  const now = new Date();
  const timestamp = now.toISOString();
  console.log(timestamp);
}

updateSnapshots();
