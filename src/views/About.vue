<template>
  <div>
    <h1>About</h1>
    <p>
      This app was created based on an interview challenge. Code at https://github.com/abea/bike-history. Data is available starting 2018-09-16.
    </p>
    <h2>The Challenge</h2>
    <blockquote cite="https://github.com/punkave/backend-challenge">
      Using MongoDB, Node.js, Express, and the Linux, Node.js and MongoDB hosting of your choice (see below for hosting details including free options), <strong>create a new API server which accumulates data over time and provides access to historical data for both weather and Indego bike availability, supporting the following queries at minimum.</strong> Note that it is sufficient to store data at hourly intervals.
    </blockquote>
    <p>
      See requirements and more information at https://github.com/punkave/backend-challenge/blob/master/README.md.
    </p>
    <h2>The App</h2>
    <p>
      The finish app is currently hosted at https://indego-history.herokuapp.com. There's a limited front-end created using Vue.js demonstrating a few elements of the overall API.
    </p>
    <p>
      There are three formats in which to request data directly from the API:
    </p>
    <ul>
      <li>
        <strong>Snapshot of all stations at a specified time:</strong> https://indego-history.herokuapp.com/api/v1/stations?at=DATETIMEHERE
      </li>
      <li>
        <strong>Snapshot of one station at a specific time:</strong> https://indego-history.herokuapp.com/api/v1/stations/KIOSKIDGOESHERE?at=DATETIMEHERE
      </li>
      <li>
        <strong>Snapshots of one station over a range of times:</strong> https://indego-history.herokuapp.com/api/v1/stations/KIOSKIDGOESHERE?from=DATETIMEHERE&to=DATETIMEHERE&frequency=[daily/hourly] (if frequency is not included, it defaults to hourly)
      </li>
    </ul>
    <p>
      Dates should be written in string format like <code>2017-11-01T11:00:00</code>.
    </p>
  </div>
</template>
