const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const bikesController = require('../controllers/bikesController');
const {catchErrors} = require('../handlers/errorHandlers');

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

module.exports = router;
