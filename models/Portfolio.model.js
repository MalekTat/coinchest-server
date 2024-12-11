const { Schema, model } = require("mongoose");


const PortfolioSchema = new Schema(
    {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    cryptoId: { type: String, required: true }, // CoinLore's cryptocurrency ID
    name: { type: String, required: true }, // Name of the cryptocurrency
    symbol: { type: String, required: true }, // Symbol (e.g., BTC, ETH)
    amount: { type: Number, required: true }, // Amount of cryptocurrency owned
    currentPrice: { type: Number }, // Current price in USD (optional)
    totalValue: { type: Number }, // Calculated total value in USD (optional)
    },
    {
    timestamps: true
    }
);

module.exports = model('Portfolio', PortfolioSchema);