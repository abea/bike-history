import axios from 'axios';
// require('dotenv').config({ path: `${__dirname}../variables.env` });

const apiClient = axios.create({
  baseURL: process.env.ROOT_URL || 'http://localhost:7777',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

const apiPath = '/api/v1/stations';

export default {
  getOneSnap(opts) {
    return apiClient.get(`${apiPath}/${opts.id}?at=${opts.time}`);
  },
  getOneSeries(opts) {
    return apiClient.get(
      `${apiPath}/${opts.id}?from=${opts.fromTime}&to=${opts.time}`
    );
  },
  getAllSnap(opts) {
    return apiClient.get(`${apiPath}?at=${opts.time}`);
  }
};
