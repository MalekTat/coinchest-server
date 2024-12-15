const { Schema, model } = require("mongoose");

const AlertSchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      cryptoId: { type: String, required: true },
      targetPrice: {
        type: Number, // The price at which the alert should trigger
        required: true,
      },
      condition: {
        type: String, // "above" or "below"
        enum: ['above', 'below'],
        required: true,
      },
      isTriggered: {
        type: Boolean,
        default: false, // True if the alert has been triggered
      },
    },
    {
      timestamps: true, // Automatically include `createdAt` and `updatedAt`
    }
  );
  
  module.exports = model('Alert', AlertSchema);