const { Schema, model } = require("mongoose");

const PortfolioSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cryptoId: { type: String, required: true }, // CoinGecko's cryptocurrency ID
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    purchasePrice: { type: Number, required: true }, // Purchase price in USD
    currentPrice: { type: Number }, // Current price in USD (updated dynamically)
    totalValue: { type: Number }, // Total value in USD (calculated dynamically)
    profitLoss: { type: Number }, // Profit or loss (calculated dynamically)
  },
  {
    timestamps: true,
  }
);

module.exports = model('Portfolio', PortfolioSchema);