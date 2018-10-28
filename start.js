const mongoose = require('mongoose');

// Import environment variables.
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE, {
  // Repond to mongoose warning about deprecated URL parser.
  useNewUrlParser: true
});

mongoose.connection.on('error', (err) => {
  console.error(`😶 Database connection error → ${err.message}`);
});

// Data models.
require('./server/models/StationDay');
require('./server/models/Weather');
require('./server/models/Cache');

const app = require('./server/app');
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
  console.info(`Express running on port ${server.address().port}`);
});
