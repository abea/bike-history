const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.send('Bike more.');
});

router.post('/api/v1/post/weather',
  weatherController.prepWeather,
  catchErrors(weatherController.saveWeather)
);

module.exports = router;
