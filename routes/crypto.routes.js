const router = require("express").Router();
const { fetchCryptos, fetchCryptoById } = require('../services/crypto.services');

// Get all cryptocurrencies
router.get('/', async (req, res, next) => {
  try {
    const cryptos = await fetchCryptos();
    res.status(200).json(cryptos);
  } catch (err) {
    next(err);
  }
});

// Get specific cryptocurrency by ID
router.get('/:id', async (req, res, next) => {
  try {
    const crypto = await fetchCryptoById(req.params.id);
    res.status(200).json(crypto);
  } catch (err) {
    next(err);
  }
});

module.exports = router;