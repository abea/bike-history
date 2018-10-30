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

export default {
  getOneSnap(opts) {
    return apiClient.get(`/api/v1/stations/${opts.id}?at=${opts.time}`);
  }
};
