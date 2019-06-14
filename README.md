## Node.js Backend Challenge

### Links
- [Indego](https://www.rideindego.com) is Philadelphia's bike-sharing program, with many bike stations in the city.
- The [Indego GeoJSON station status API](https://www.rideindego.com/stations/json/) provides a realtime snapshot of the number of bikes available, number of open docks available (not currently containing a bike), and total number of docks at every station. This API is free and requires no API key.
- The [Open Weather Map API](https://openweathermap.org/current#name) provides a realtime snapshot of the current weather in a given city. Since Philadelphia is a small geographical area it is sufficient to obtain the weather for a geographical location central to Philadelphia. This API has a free plan, you will need to sign up for an API key.

### Goal
Using MongoDB, Node.js, Express, [Bluebird](https://npmjs.org/package/bluebird), Lodash and the Linux, Node.js and MongoDB hosting of your choice (see below for hosting details including free options), **create a new API server which accumulates data over time and provides access to historical data for both weather and Indego bike availability, supporting the following queries at minimum.** Note that it is sufficient to store data at hourly intervals.

### Running in production
To run in production, schedule the command `npm run updater` to run hourly on the hour with cron or otherwise to collect data.

## Requirements
- [X] App stores Indego and weather data
- [X] App downloads fresh Indego and weather data once per hour
- [X] App provides an API to access Indego and weather data
- [X] App API supports the following queries at a minimum:
  - [X] Snapshot of all stations at a specified time (`/api/v1/stations?at=2017-11-01T11:00:00`)
  - [X] Snapshot of one station at a specific time (`/api/v1/stations/KIOSKIDGOESHERE?at=2017-11-01T11:00:00`)
  - [X] Snapshots of one station over a range of times  (`/api/v1/stations/KIOSKIDGOESHERE?from=2017-11-01T11:00:00&to=2017-12-01T11:00:00&frequency=daily`)
- [X] App should have mocha tests built for all requirements
  - [X] Storing indego and weather data
  - [ ] Downloading once per hour ???
  - [X] Providing API for data
    - [X] All station at time query
    - [X] One station at time query
    - [X] One station over time span query
- [X] App is hosted and accessible publicly
- [X] Extra credit: Implement Vue front end with data visualization

### Snapshot of all stations at a specified time

Data for all stations as of 11am Universal Coordinated Time on November 1st, 2017:

`/api/v1/stations?at=2017-11-01T11:00:00`

This API should respond as follows, with the actual time of the first snapshot of data on or after the requested time and the data:

```javascript
{
  at: '2017-11-01:T11:00:01',
  weather: { /* as per the Open Weather Map API response for Philadelphia */ },
  stations: { /* As per the Indego API */ }
}
```

If no suitable data is available a 404 status code should be given.

### Snapshot of one station at a specific time

Data for a specific station (by its `kioskId`) at a specific time:

`/api/v1/stations/KIOSKIDGOESHERE?at=2017-11-01T11:00:00`

The response should be the first available on or after the given time, and should look like:

```javascript
{
  at: '2017-11-01:T11:00:01',
  weather: { /* as per the Open Weather Map API response for Philadelphia */ },
  station: { /* Data just for this one station as per the Indego API */ }
}
```

Include an `at` property in the same format indicating the actual time of the snapshot.

If no suitable data is available a 404 status code should be given.

### Snapshots of one station over a range of times

All historical data for a specific station between two timestamps:

`/api/v1/stations/KIOSKIDGOESHERE?from=2017-11-01T11:00:00&to=2017-12-01T11:00:00&frequency=daily`

For this last response, the returned JSON value should be an array of values in ascending chronological order. **Each element in the array** should look like:

```javascript
{
  at: '2017-11-02T10:00:00',
  station: { /* snapshot in the same format as the other APIs */ },
  weather: { /* as per the Open Weather Map API response for Philadelphia */ }
}
```

The `frequency` query parameter, if present, may be `hourly` or `daily`. The API should respond with only one entry from each hour or day. For `hourly` this should be the first entry on or after the top of the hour. For `daily` it should be the first entry on or after noon, Philadelphia time. If `frequency` is absent, `hourly` is the default.

### Unit tests

All of the APIs should have unit test coverage; invoking `npm test` should test your package. We suggest [mocha](https://npmjs.org/package/mocha) but other frameworks are fine.
