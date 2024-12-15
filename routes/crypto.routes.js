const router = require("express").Router();
const { fetchCryptos, fetchCryptoById, fetchCryptoHistory, fetchConversionRate } = require('../services/crypto.services');


// Get conversion rates (USD <-> EUR)
router.get('/rates', async (req, res, next) => {
  try {
    const rates = await fetchConversionRate();
    res.status(200).json(rates);
  } catch (err) { 
    next(err);
  }
});


// Get top cryptocurrencies
router.get('/top', async (req, res, next) => {
  try {
    const cryptos = await fetchCryptos(30);
    res.status(200).json(cryptos);
  } catch (err) {
    next(err);
  }
});

// Get details for a specific cryptocurrency
router.get('/:id', async (req, res, next) => {
  try {
    const crypto = await fetchCryptoById(req.params.id);
    res.status(200).json(crypto);
  } catch (err) {
    next(err);
  }
});

// Get historical data for a specific cryptocurrency
router.get('/:id/history', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { days } = req.query; // Optional query parameter
    const history = await fetchCryptoHistory(id, days || 30);
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
});




module.exports = router;