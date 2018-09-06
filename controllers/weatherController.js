exports.prepWeather = (req, res) => {
  const data = req.body;
  console.log(Object.keys(req.body));

  const weather = data.weather;
  // Get the coordinates into geometry format.
  weather.geometry.coordinates = [weather.coord.lon, weather.coord.lat];
  delete weather.coord;

  // return new weather object (req.body.weather) and timestamp (req.body.timestamp)
  data.weather = weather;
  console.log('🕙', data.timestamp);
  console.log('⛈', data.weather);
  // next();
};

exports.saveWeather = (req, res) => {
  // Check if a document exists for that calendar day.
  // If so, get the hour and update the document with the weather at that hour.
  // If not, create big ass object with space for each hour.
  //   Then save the new document.
};
