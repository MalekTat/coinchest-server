const router = require('express').Router();
const AlertModel = require('../models/Alert.model');
const { isAuthenticated } = require('../middlewares/jwt.middleware');
const { fetchCryptoById } = require('../services/crypto.services');
const { editAlert } = require('../services/alerts.services');



// Create an alert
router.post('/', isAuthenticated, async (req, res, next) => {
  const { cryptoId, targetPrice, condition } = req.body;

  try {
    const newAlert = await AlertModel.create({
      userId: req.payLoad.currentUser._id,
      cryptoId,
      targetPrice,
      condition,
    });

    res.status(201).json(newAlert);
  } catch (error) {
    console.error('Error creating alert:', error.message);
    next(error);
  }
});



// Get all alerts for the authenticated user
router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const alerts = await AlertModel.find({ userId: req.payLoad.currentUser._id });
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error.message);
    next(error);
  }
});



// edit an alert
router.put('/:id', isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { cryptoId, condition, targetPrice, isTriggered } = req.body;

  try {
    const updatedAlert = await editAlert(req.payLoad.currentUser._id , id, {
      cryptoId,
      condition,
      targetPrice,
      isTriggered,
    });

    if (!updatedAlert) {
      return res.status(404).json({ message: 'Alert not found or not authorized.' });
    }

    res.status(200).json(updatedAlert);
    
  } catch (err) {
    console.error('Error updating alert:', err.message);
    next(err); 
  }
});


// Delete an alert
router.delete('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const alert = await AlertModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.payLoad.currentUser._id,
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found or unauthorized' });
    }

    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error.message);
    next(error);
  }
});

// Check if alerts are triggered
router.get('/check', isAuthenticated, async (req, res, next) => {
  try {
    const alerts = await AlertModel.find({ userId: req.payLoad.currentUser._id, isTriggered: false });

    const triggeredAlerts = [];
    for (const alert of alerts) {
      const cryptoDetails = await fetchCryptoById(alert.cryptoId);
      const currentPrice = cryptoDetails.market_data.current_price.usd;

      const isTriggered =
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (isTriggered) {
        alert.isTriggered = true;
        await alert.save(); // Update the alert as triggered
        triggeredAlerts.push(alert);
      }
    }

    res.status(200).json(triggeredAlerts);
  } catch (error) {
    console.error('Error checking alerts:', error.message);
    next(error);
  }
});

module.exports = router;