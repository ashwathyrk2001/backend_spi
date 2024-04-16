const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderDate: { type: Date, default: Date.now },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    houseNo: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
     // Add phone number field
  },
  phoneNumber: { type: String, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
