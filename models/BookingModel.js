const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deliveryAddress: {
    houseNo: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
  },
  phoneNumber: { type: String },
  bookingAmount: { type: Number, required: true },
  bookingAmountUnit: { type: String, default: 'kg' },
  bookingDate: { type: Date },
  bookingTime: { type: String },
  sold: { type: Boolean, default: false }, 
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
