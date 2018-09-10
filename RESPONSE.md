- All include a results are an object with results and a status response

## One station, one time
  - Hour property (timestamp)
  - Weather property
  - Station snapshot property
## All stations at one time
  - Hour property
  - Weather property
  - Object of station snapshots (by kiosk)
## One station over time
  - Array of time snapshot objects (hours)
    - Hour property
    - Weather property
    - Station snapshot property
  - Accepts a query string (daily/hourly)
