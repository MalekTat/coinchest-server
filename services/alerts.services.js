const AlertModel = require('../models/Alert.model');
const apiClient = require('../utils/apiClient.utils');



// Function to calculate if an alert is triggered
const checkTriggerCondition = async (cryptoId, targetPrice, condition) => {
  try {
    const response = await apiClient.get(`/simple/price`, {
      params: { ids: cryptoId, vs_currencies: 'usd' },
    });

    const currentPrice = response.data[cryptoId]?.usd;

    const isTriggered =
      (condition === 'above' && currentPrice > targetPrice) ||
      (condition === 'below' && currentPrice < targetPrice);

    return isTriggered;
  } catch (error) {
    console.error('Error fetching current price:', error.message);
    throw new Error('Failed to check trigger condition.');
  }
};



// Process Alerts: Check and update isTriggered for all alerts
const processAlerts = async () => {
  try {
    const alerts = await AlertModel.find();

    for (const alert of alerts) {
      const isTriggered = await checkTriggerCondition(
        alert.cryptoId,
        alert.targetPrice,
        alert.condition
      );

      if (isTriggered && !alert.isTriggered) {
        alert.isTriggered = true;
        await alert.save();

        /*
        // Optional: Send email notification
        await sendEmail(
          alert.userEmail,
          'Price Alert Triggered',
          `Your alert for ${alert.cryptoId} was triggered.`
        );
        */
      }
    }

    console.log('Alerts processed successfully.');
  } catch (error) {
    console.error('Error processing alerts:', error.message);
    throw new Error('Failed to update alert.');
  }
};


module.exports = { processAlerts, checkTriggerCondition };