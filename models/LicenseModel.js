const mongoose = require('mongoose');

const licenseRequestSchema = new mongoose.Schema({
  dealerName: { type: String, required: true },
  dealerEmail: { type: String, required: true },
  tradeCode: { type: String, required: true },
  address: { type: String, required: true },
  shopLicenseNumber: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

const LicenseRequest = mongoose.model('LicenseRequest', licenseRequestSchema);

module.exports = LicenseRequest;
