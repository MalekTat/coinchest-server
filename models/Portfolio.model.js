const { Schema, model } = require("mongoose");

const PortfolioSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cryptoId: { type: String, required: true }, // CoinGecko's cryptocurrency ID
    amount: { type: Number, required: true },
    totalPurchasePrice: { type: Number, required: true }, // Total purchase price in USD
  },
  {
    timestamps: true,
  }
);

module.exports = model('Portfolio', PortfolioSchema);