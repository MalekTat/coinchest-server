const axios = require('axios');


// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.Root_URL_API, 
  headers: {
    'x-cg-demo-api-key': process.env.COINGECKO_API_KEY, 
  }
});

module.exports = apiClient;