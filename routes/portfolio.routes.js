const router = require('express').Router();
const PortfolioModel = require('../models/Portfolio.model');
const { updatePortfolioValues, buyCrypto, sellCrypto } = require('../services/portfolio.services');
const { isAuthenticated } = require('../middlewares/jwt.middleware');

// Get all portfolio items for the authenticated user
router.get('/', isAuthenticated, async (req, res, next) => {
  const { _id } = req.payLoad.currentUser;
  try {
    const portfolioArr = await PortfolioModel.find({ userId: _id });
    const updatedPortfolioArr = await Promise.all(portfolioArr.map(updatePortfolioValues));
    res.json(updatedPortfolioArr);
  } catch (err) {
    next(err);
  }
});


// Buy Crypto
router.post('/buy', isAuthenticated, async (req, res, next) => {
  const { cryptoId, amount, purchasePrice } = req.body;
  const { _id: userId } = req.payLoad.currentUser;

  try {
    const updatedPortfolio = await buyCrypto(userId, cryptoId, amount, purchasePrice);
    res.status(200).json(updatedPortfolio);
  } catch (err) {
    next(err);
  }
});

// Sell Crypto
router.post('/sell', isAuthenticated, async (req, res, next) => {
  const { cryptoId, amount, sellPrice } = req.body;
  const { _id: userId } = req.payLoad.currentUser;

  try {
    const updatedPortfolio = await sellCrypto(userId, cryptoId, amount, sellPrice);
    res.status(200).json(updatedPortfolio);
  } catch (err) {
    next(err);
  }
});


module.exports = router;






