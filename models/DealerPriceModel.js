const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  maxPrice: { type: Number, required: true },
  avgPrice: { type: Number, required: true },
  dealerName: { type: String, required: true },
  dealerLocation: { type: String, required: true },
});

const Price = mongoose.model('Price', PriceSchema);

module.exports = Price;
