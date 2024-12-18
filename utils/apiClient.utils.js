const axios = require('axios');


// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3', 
  headers: {
    'x-cg-demo-api-key': process.env.COINGECKO_API_KEY, 
  }
});

module.exports = apiClient;