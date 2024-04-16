const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  houseNo: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String },
  address: { type: addressSchema, required: true },
  role: {
    type: String,
    enum: ['customer', 'landowner', 'dealer', 'admin','parcher'],
    default: 'customer',
  },
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
