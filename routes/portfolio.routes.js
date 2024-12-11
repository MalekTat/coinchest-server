const router = require("express").Router();
const PortfolioModel = require('../models/Portfolio.model');
const { updatePortfolioValues } = require('../services/portfolio.services');
const { isAuthenticated } = require("../middlewares/jwt.middleware");

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

// Add a new cryptocurrency to the user's portfolio
router.post('/', isAuthenticated, async (req, res, next) => {
    const { cryptoId, name, symbol, amount } = req.body;
    try {
      const newPortfolioItem = await PortfolioModel.create({
        userId: req.payLoad.currentUser._id, 
        cryptoId,
        name,
        symbol,
        amount,
      });
  
      res.json(newPortfolioItem);
    } catch (err) {
      next(err);
    }
  });


// Delete a portfolio item

router.delete('/:id', isAuthenticated, async (req, res, next) => {
  const { _id } = req.payLoad.currentUser;
  try {
    const portfolioItem = await PortfolioModel.findOneAndDelete({ userId: _id, cryptoId: req.params.id });

    if (!portfolioItem) {
      return res.status(404).json({ msg: 'Portfolio item not found' });
    }
    res.json({ msg: 'Portfolio item removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
