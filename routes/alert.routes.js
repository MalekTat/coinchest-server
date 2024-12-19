const router = require('express').Router();
const AlertModel = require('../models/Alert.model');
const { isAuthenticated } = require('../middlewares/jwt.middleware');
const { checkTriggerCondition } = require('../services/alerts.services');



// Create an alert
router.post('/', isAuthenticated, async (req, res, next) => {
  let { cryptoId, targetPrice, condition } = req.body;

  try {

    targetPrice = parseFloat(targetPrice); 
    if (isNaN(targetPrice)) {
      return res.status(400).json({ message: 'Invalid target price. It must be a number.' });
    }

    // Check if the alert is already triggered at creation time
    const isTriggered = await checkTriggerCondition(cryptoId, targetPrice, condition);

    const newAlert = await AlertModel.create({
      userId: req.payLoad.currentUser._id,
      cryptoId,
      targetPrice,
      condition,
      isTriggered,
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
  let { cryptoId, condition, targetPrice } = req.body;

  try {

    targetPrice = parseFloat(targetPrice); 
    if (isNaN(targetPrice)) {
      return res.status(400).json({ message: 'Invalid target price. It must be a number.' });
    }

    // Check if the updated alert is triggered
    const isTriggered = await checkTriggerCondition(cryptoId, targetPrice, condition);

    const updatedAlert = await AlertModel.findOneAndUpdate(
      { _id: id, userId: req.payLoad.currentUser._id },
      { cryptoId, condition, targetPrice, isTriggered },
      { new: true } // Return the updated document
    );

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



module.exports = router;