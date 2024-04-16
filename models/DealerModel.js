const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  dealerName: { type: String, required: true },
  dealerLicense: { type: String, required: true },
  dealerEmail: { type: String, required: true, unique: true },
  dealerLocation: { type: String, required: true },
 

  approved: { type: Boolean, default: false },
});

const Dealer = mongoose.model('Dealer', dealerSchema);

module.exports = Dealer;
