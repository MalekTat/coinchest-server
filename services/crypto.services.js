const apiClient = require('../utils/apiClient.utils');

// Fetch all cryptocurrencies
const fetchCryptos = async (limit = 30) => {
  try {
    const response = await apiClient.get(`/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching cryptocurrencies:', err.message);
    throw err;
  }
};


// Fetch specific cryptocurrency details
const fetchCryptoById = async (id) => {
  try {
    const response = await apiClient.get(`/coins/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching cryptocurrency details:`, err.message);
    throw err;
  }
};


// Fetch historical data for a specific cryptocurrency
const fetchCryptoHistory = async (id, days = 30) => {
  try {
    const response = await apiClient.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
      },
    });
    return response.data;
  } catch (err) {
    console.error(`Error fetching historical data details:`, err.message);
    throw err;
  }
};



// Fetch conversion rates
const fetchConversionRate = async () => {
  try {
    const response = await apiClient.get('/exchange_rates');
    const rates = response.data.rates;
    return {
      usdToEur: rates.eur.value / rates.usd.value,
      eurToUsd: rates.usd.value / rates.eur.value,
    };
  } catch (err) {
    console.error('Error fetching conversion rates:', err.message);
    throw err;
  }
};


// Fetch top exchanges
const fetchTopExchanges = async () => {
  try {
    const response = await apiClient.get('/exchanges', {
      params: {
        per_page: 15, 
        page: 1,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching top exchanges:', err.message);
    throw err;
  }
};



module.exports = { fetchCryptos, fetchCryptoById, fetchCryptoHistory, fetchConversionRate, fetchTopExchanges};