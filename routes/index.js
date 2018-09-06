const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/', (req, res) => {
  res.send('Bike more.');
});

router.post('/api/v1/post/weather',
  weatherController.prepWeather
);

module.exports = router;
