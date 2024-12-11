const router = require("express").Router();
const Portfolio = require('../models/Portfolio.model');
const { updatePortfolioValues } = require('../services/portfolio.services');
const auth = require('../middlewares/auth');

// Get all portfolio items for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user.id });
    const updatedPortfolio = await Promise.all(portfolio.map(updatePortfolioValues));
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a new cryptocurrency to the user's portfolio
router.post('/', auth, async (req, res) => {
  const { cryptoId, name, symbol, amount } = req.body;
  try {
    const newPortfolioItem = new Portfolio({
      userId: req.user.id,
      cryptoId,
      name,
      symbol,
      amount,
    });

    const savedPortfolioItem = await newPortfolioItem.save();
    res.json(savedPortfolioItem);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Delete a portfolio item
router.delete('/:id', auth, async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    if (!portfolioItem || portfolioItem.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Portfolio item not found' });
    }
    await portfolioItem.remove();
    res.json({ msg: 'Portfolio item removed' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;