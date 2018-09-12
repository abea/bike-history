const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const bikesController = require('../controllers/bikesController');
const {catchErrors} = require('../handlers/errorHandlers');
const indegoDump = require('../sample-data/indego-dump.json');

router.get('/', (req, res) => {
  res.send('Bike more.');
});

router.post('/api/v1/post/weather',
  weatherController.prepWeather,
  catchErrors(weatherController.saveWeather)
);

router.post('/api/v1/post/bikes',
  catchErrors(bikesController.saveStations)
);

router.get('/api/v1/get/bike-processing',
  bikesController.getStatus
);

router.get('/api/v1/get/sample-bikes',
  (req, res) => {
    res.send(indegoDump);
  }
);

module.exports = router;
