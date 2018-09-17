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

router.get('/api/v1/get/bike-processing/:cacheId',
  bikesController.getPostStatus
);

router.get('/api/v1/stations',
  catchErrors(weatherController.returnWeather),
  catchErrors(bikesController.returnStations)
  // - If `at` query string, run getAt
  //  - Get the one weather result
  //  - If kioskId, get that, if not, get all at that time.
  // - Else if from and to query strings, run getBetween
);

router.get('/api/v1/stations/:kioskId',
  catchErrors(weatherController.returnWeather),
  catchErrors(bikesController.returnStations)
  // - If `at` query string, run getAt
  //  - Get the one weather result
  //  - If kioskId, get that, if not, get all at that time.
  // - Else if from and to query strings, run getBetween
);

router.get('/api/v1/get/sample-bikes',
  (req, res) => {
    res.send(indegoDump);
  }
);

module.exports = router;
