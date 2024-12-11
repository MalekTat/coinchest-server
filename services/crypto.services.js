const axios = require('axios');
require('dotenv').config();

const COINLORE_API_URL = process.env.COINLORE_API_URL;

// Fetch all cryptocurrencies
const fetchCryptos = async () => {
  try {
    const response = await axios.get(`${COINLORE_API_URL}/tickers/`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error.message);
    throw error;
  }
};

// Fetch specific cryptocurrency details
const fetchCryptoById = async (id) => {
  try {
    const response = await axios.get(`${COINLORE_API_URL}/ticker/?id=${id}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching cryptocurrency details:', error.message);
    throw error;
  }
};

module.exports = { fetchCryptos, fetchCryptoById };