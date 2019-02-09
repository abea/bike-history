import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.ROOT_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

const apiPath = '/api/v1/stations';

export default {
  getOneSnap(opts) {
    return apiClient.get(`${apiPath}/${opts.id}?at=${opts.toTime}`);
  },
  getOneSeries(opts) {
    return apiClient.get(
      `${apiPath}/${opts.id}?from=${opts.fromTime}&to=${opts.toTime}`
    );
  },
  getAllSnap(opts) {
    return apiClient.get(`${apiPath}?at=${opts.toTime}`);
  }
};
