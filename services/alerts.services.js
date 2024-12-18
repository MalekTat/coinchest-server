const AlertModel = require('../models/Alert.model');


const editAlert = async (userId, alertId, updateData) => {
  try {

    const updatedAlert = await AlertModel.findOneAndUpdate(
      { _id: alertId, userId: userId },
      updateData, 
      { new: true } 
    );

    return updatedAlert; 
  } catch (err) {
    console.error('Error in editAlert service:', err.message);
    throw new Error('Failed to edit alert.');
  }
};

module.exports = { editAlert };