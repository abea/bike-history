const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const bikesController = require('../controllers/bikesController');
const deliveryController = require('../controllers/deliveryController');
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

router.get('/api/v1/get/stations',
  catchErrors(weatherController.returnWeather),
  catchErrors(bikesController.returnStations),
  deliveryController.returnResults
);

router.get('/api/v1/get/stations/:kioskId',
  catchErrors(weatherController.returnWeather),
  catchErrors(bikesController.returnStations),
  deliveryController.returnResults
);

router.get('/api/v1/get/sample-bikes',
  (req, res) => {
    res.send(indegoDump);
  }
);

module.exports = router;
