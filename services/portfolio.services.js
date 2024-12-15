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
    const usdToEur = ratesResponse.data.rates.eur.value / ratesResponse.data.rates.usd.value;

    const updatedPortfolio = {
      _id: portfolio._id,
      userId: portfolio.userId,
      cryptoId: portfolio.cryptoId,
      amount: portfolio.amount,
      totalPurchasePrice: portfolio.totalPurchasePrice,
      currentPriceUSD : Math.round(currentPriceUSD * 100) / 100,
      currentPriceEUR: Math.round(currentPriceUSD * usdToEur * 100 ) /100,
      totalValueUSD: Math.round(currentPriceUSD * portfolio.amount * 100) / 100,
      totalValueEUR: Math.round(currentPriceUSD * portfolio.amount * usdToEur * 100) / 100,
      profitLossUSD: Math.round((currentPriceUSD * portfolio.amount - portfolio.amount * portfolio.totalPurchasePrice) * 100 ) / 100,
      profitLossEUR: Math.round((currentPriceUSD * portfolio.amount - portfolio.amount * portfolio.totalPurchasePrice) * usdToEur * 100) / 100,
    };

    return updatedPortfolio;

  } catch (err) {
    console.error('Error updating portfolio values:', err.message);
    throw err;
  }
};


// Handle Buy Operation
const buyCrypto = async (userId, cryptoId, purchaseAmount, purchasePrice) => {
  try {
    const portfolio = await PortfolioModel.findOne({ userId, cryptoId });

    if (portfolio) {
      // Update existing portfolio entry
      portfolio.totalPurchasePrice += purchaseAmount * purchasePrice;
      portfolio.amount += purchaseAmount;
      await portfolio.save();
    } else {
      // Create a new portfolio entry if it doesn't exist
      const newPortfolio = new PortfolioModel({
        userId,
        cryptoId,
        amount: purchaseAmount,
        totalPurchasePrice: purchaseAmount * purchasePrice,
      });
      await newPortfolio.save();
    }

    return portfolio || newPortfolio;
  } catch (error) {
    console.error(`Error in buyCrypto: ${error.message}`);
    throw new Error('Failed to process buy operation.');
  }
}



// Handle Sell Operation
const sellCrypto = async (userId, cryptoId, sellAmount, sellPrice) => {
  try {
    const portfolio = await PortfolioModel.findOne({ userId, cryptoId });

    if (!portfolio || portfolio.amount < sellAmount) {
      throw new Error('Insufficient amount to sell');
    }

    // Proportionally adjust the total purchase price
    portfolio.totalPurchasePrice -= sellAmount * sellPrice;
    portfolio.amount -= sellAmount;

    // Remove portfolio if no crypto is left
    if (portfolio.amount <= 0) {
      await PortfolioModel.deleteOne({ _id: portfolio._id });
    } else {
      await portfolio.save();
    }

    return portfolio;
  } catch (error) {
    console.error(`Error in sellCrypto: ${error.message}`);
    throw new Error('Failed to process sell operation.');
  }
};

module.exports = { updatePortfolioValues, buyCrypto, sellCrypto };