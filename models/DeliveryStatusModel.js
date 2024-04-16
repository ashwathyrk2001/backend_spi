// models/DeliveryStatus.js
const mongoose = require('mongoose');

const deliveryStatusSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  orderConfirmed: { type: Boolean, default: false },
  shipped: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const DeliveryStatus = mongoose.model('DeliveryStatus', deliveryStatusSchema);

module.exports = DeliveryStatus;
