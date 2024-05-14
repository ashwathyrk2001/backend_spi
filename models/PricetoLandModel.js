// models/PriceToLandModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  dealerName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  highestPrice: {
    type: Number,
    required: true
  },
  averagePrice: {
    type: Number,
    required: true
  },
  spiceCenterName: {
    type: String,
    required: true
  },
  address: {
    area: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pinCode: {
      type: String,
      required: true
    }
  }
});


const Price = mongoose.model('Price', priceSchema);

module.exports = Price;
