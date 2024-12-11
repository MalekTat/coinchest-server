const axios = require('axios');
const Portfolio = require('../models/Portfolio.model');
require('dotenv').config();

const COINLORE_API_URL = process.env.COINLORE_API_URL;

const updatePortfolioValues = async (portfolio) => {
  try {
    const response = await axios.get(`${COINLORE_API_URL}/ticker/?id=${portfolio.cryptoId}`);
    const currentPrice = parseFloat(response.data[0].price_usd);
    portfolio.currentPrice = currentPrice;
    portfolio.totalValue = currentPrice * portfolio.amount;
    return portfolio;
  } catch (error) {
    console.error('Error updating portfolio values:', error.message);
    throw error;
  }
};

module.exports = { updatePortfolioValues };