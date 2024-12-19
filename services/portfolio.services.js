const apiClient = require('../utils/apiClient.utils');
const PortfolioModel = require('../models/Portfolio.model');

const updatePortfolioValues = async (portfolio) => {
  try {
    // Fetch current price and conversion rates
    const [cryptoResponse, ratesResponse] = await Promise.all([
      apiClient.get(`/coins/${portfolio.cryptoId}`),
      apiClient.get(`/exchange_rates`),
    ]);

    const currentPriceUSD = parseFloat(cryptoResponse.data.market_data.current_price.usd);
    const usdToEur = parseFloat((ratesResponse.data.rates.eur.value / ratesResponse.data.rates.usd.value).toFixed(6));

    const updatedPortfolio = {
      _id: portfolio._id,
      userId: portfolio.userId,
      cryptoId: portfolio.cryptoId,
      name: cryptoResponse.data.name,
      image: cryptoResponse.data.image.small,
      amount: parseFloat(portfolio.amount.toFixed(6)),
      totalPurchasePrice: parseFloat(portfolio.totalPurchasePrice.toFixed(2)),
      currentPriceUSD: parseFloat(currentPriceUSD.toFixed(2)),
      currentPriceEUR: parseFloat((currentPriceUSD * usdToEur).toFixed(2)),
      totalValueUSD: parseFloat((currentPriceUSD * portfolio.amount).toFixed(2)),
      totalValueEUR: parseFloat((currentPriceUSD * portfolio.amount * usdToEur).toFixed(2)),
      profitLossUSD: parseFloat(((currentPriceUSD * portfolio.amount - portfolio.totalPurchasePrice).toFixed(2))),
      profitLossEUR: parseFloat(((currentPriceUSD * portfolio.amount - portfolio.totalPurchasePrice) * usdToEur).toFixed(2)),
    };

    return updatedPortfolio;

  } catch (err) {
    console.error('Error updating portfolio values:', err.message);
    throw err;
  }
};

// Handle Buy Operation
const buyCrypto = async (userId, cryptoId, amount, price) => {
  try {
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedAmount) || isNaN(parsedPrice)) {
      throw new Error('Invalid amount or price');
    }

    const portfolio = await PortfolioModel.findOne({ userId, cryptoId });

    if (portfolio) {
      portfolio.totalPurchasePrice = parseFloat((portfolio.totalPurchasePrice + parsedAmount * parsedPrice).toFixed(2));
      portfolio.amount = parseFloat((portfolio.amount + parsedAmount).toFixed(6));
      await portfolio.save();
      return portfolio;
    } else {
      const newPortfolio = new PortfolioModel({
        userId,
        cryptoId,
        amount: parseFloat(parsedAmount.toFixed(6)),
        totalPurchasePrice: parseFloat((parsedAmount * parsedPrice).toFixed(2)),
      });
      await newPortfolio.save();
      return newPortfolio;
    }
  } catch (error) {
    console.error(`Error in buyCrypto: ${error.message}`);
    throw new Error('Failed to process buy operation.');
  }
};

// Handle Sell Operation
const sellCrypto = async (userId, cryptoId, amount, price) => {
  try {
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedAmount) || isNaN(parsedPrice)) {
      throw new Error('Invalid amount or price');
    }

    const portfolio = await PortfolioModel.findOne({ userId, cryptoId });

    if (!portfolio || portfolio.amount < parsedAmount) {
      throw new Error('Insufficient amount to sell');
    }

    portfolio.totalPurchasePrice = parseFloat((portfolio.totalPurchasePrice - parsedAmount * parsedPrice).toFixed(2));
    portfolio.amount = parseFloat((portfolio.amount - parsedAmount).toFixed(6));

    await portfolio.save();
    return portfolio;

  } catch (error) {
    console.error(`Error in sellCrypto: ${error.message}`);
    throw new Error('Failed to process sell operation.');
  }
};

module.exports = { updatePortfolioValues, buyCrypto, sellCrypto };
