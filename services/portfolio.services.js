const apiClient = require('../utils/apiClient.utils');

const updatePortfolioValues = async (portfolio) => {
  try {
    // Fetch current price and conversion rates
    const [cryptoResponse, ratesResponse] = await Promise.all([
      apiClient.get(`/coins/${portfolio.cryptoId}`),
      apiClient.get(`/exchange_rates`),
    ]);

    const currentPriceUSD = parseFloat(cryptoResponse.data.market_data.current_price.usd);
    const usdToEur = ratesResponse.data.rates.eur.value / ratesResponse.data.rates.usd.value;

    // Calculate portfolio values
    portfolio.currentPriceUSD = currentPriceUSD;
    portfolio.currentPriceEUR = currentPriceUSD * usdToEur;
    portfolio.totalValueUSD = currentPriceUSD * portfolio.amount;
    portfolio.totalValueEUR = portfolio.totalValueUSD * usdToEur;
    portfolio.profitLossUSD = portfolio.totalValueUSD - (portfolio.amount * portfolio.purchasePrice);
    portfolio.profitLossEUR = portfolio.profitLossUSD * usdToEur;

    return portfolio;
  } catch (err) {
    console.error('Error updating portfolio values:', err.message);
    throw err;
  }
};

module.exports = { updatePortfolioValues };