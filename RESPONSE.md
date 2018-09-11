- All include a results are an object with results and a status response

## One station, one time
  - Hour property (timestamp)
  - Weather property
  - Station snapshot property

### Query
  - `db.weather.findOne{ _id: date }`
    - Filter for the hour requested
  - `db.stationDays.findOne{ _id: kiosk id + date }`
    - Filter for the hour requested

## All stations at one time
  - Hour property
  - Weather property
  - Object of station snapshots (by kiosk)

### Query
  - `db.weather.findOne{ _id: date }`
    - Filter for the hour requested
  - `db.stationDays.find{ _id: ${$matches: date regex} }`
    - Filter for the hour requested

## One station over time
  - Array of time snapshot objects (hours)
    - Hour property
    - Weather property
    - Station snapshot property
  - Accepts a query string (daily/hourly)

### Query
  - Convert start and end timestamps to days (w/o hour)
  - `db.weather.find{ day stamp: {$and: [{$gte: start}, {$lte: end}]} }`
  - `db.stationDays.find{ _id: {$matches: kiosk regex}, day stamp: {$and: [{$gte: start}, {$lte: end}]} }`
  - Filter for the hours requested using `$gte/$lte` on hour timestamps
