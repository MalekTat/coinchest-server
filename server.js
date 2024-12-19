const app = require("./app");

const cron = require('node-cron');
const { processAlerts } = require('./services/alerts.services');


// Schedule the alerts processor to run every 5 minutes    ( */1 * * * * )   30sec  
cron.schedule('*/10 * * * * *', async () => {
  console.log('Running scheduled alerts processing...');
  await processAlerts();
}); 

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
