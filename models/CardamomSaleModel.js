const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardamomSaleSchema = new Schema({
  priceId: {
    type: Schema.Types.ObjectId,
    ref: 'Price', // Reference to the Price model if needed
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  spiceCenterName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  landownersName: { // New field for Landowner's Name
    type: String,
    required: true
  },
  phoneNumber: { // New field for Phone Number of the Landowner
    type: String,
    required: true
  },
  quantity: { // New field for Quantity of Cardamom (kg)
    type: Number,
    required: true
  },
  image: {
    type: String, // Assuming the image path will be stored as a string
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const CardamomSale = mongoose.model('CardamomSale', cardamomSaleSchema);

module.exports = CardamomSale;
