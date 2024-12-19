const router = require('express').Router();
const { processAlerts } = require('../services/alerts.services');

// Route to trigger processAlerts manually or through a scheduler
router.post('/', async (req, res) => {
  try {
    await processAlerts(); 
    res.status(200).json({ message: 'Alerts processed successfully' });
  } catch (error) {
    console.error('Error processing alerts:', error.message);
    res.status(500).json({ error: 'Failed to process alerts' });
  }
});

module.exports = router;