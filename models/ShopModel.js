const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  shopLicense: { type: String, required: true },
  shopEmail: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  spiceCapacity: { type: String, required: true }, // Add the new field
  parchingPrice: { type: String, required: true },
  approved: { type: Boolean, default: false },
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;