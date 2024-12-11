const router = require("express").Router();
const { fetchCryptos, fetchCryptoById } = require('../services/crypto.services');

// Get all cryptocurrencies
router.get('/', async (req, res) => {
  try {
    const cryptos = await fetchCryptos();
    res.status(200).json(cryptos);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get specific cryptocurrency by ID
router.get('/:id', async (req, res) => {
  try {
    const crypto = await fetchCryptoById(req.params.id);
    res.status(200).json(crypto);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;