const weatherSchema = {
  type: 'weather',
  location: [
    {'lat': ''},
    {'lng': ''}
  ],
  days: [
    {
      timeStamp: String,
      weather: Object,
      hours: [
        {
          timeStamp: String,
          weather: Object
        },
        {
          timeStamp: String,
          weather: Object
        }
      ]
    }
  ]
};

const indegoSchema = {
  type: 'station',
  stationId: '',
  days: [
    {
      timeStamp: String,
      status: Object,
      hours: [
        {
          timeStamp: String,
          status: Object
        },
        {
          timeStamp: String,
          status: Object
        }
      ]
    }
  ]
};
