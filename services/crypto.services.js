const axios = require('axios');

const COINLORE_API_URL = process.env.COINLORE_API_URL;

// Fetch all cryptocurrencies
const fetchCryptos = async () => {
  try {
    const response = await axios.get(`${COINLORE_API_URL}/tickers/`);
    return response.data.data;
  } catch (err) {
    console.error('Error fetching cryptocurrencies:', err.message);
    throw err;
  }
};

// Fetch specific cryptocurrency details
const fetchCryptoById = async (id) => {
  try {
    const response = await axios.get(`${COINLORE_API_URL}/ticker/?id=${id}`);
    return response.data[0];
  } catch (err) {
    console.error('Error fetching cryptocurrency details:', err.message);
    throw err;
  }
};

module.exports = { fetchCryptos, fetchCryptoById };