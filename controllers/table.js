// routes/users.js
const express = require('express');
const router = express.Router();
const Users = require('../models/UserModel');
const Shop = require('../models/ShopModel');
const Order = require('../models/OrderModel');
const Booking = require('../models/BookingModel')
const Dealer = require('../models/DealerModel')

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate that userId is a valid ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // Find the user by userId
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the user data as the response
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by userId', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/ordertable', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  module.exports = router;


  router.get('/shop', async (req, res) => {
    try {
      const shops = await Shop.find();
      res.json(shops);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  router.get('/dealertable', async (req, res) => {
    try {
      const shops = await Dealer.find();
      res.json(shops);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });



  router.get('/bookingdetails', async (req, res) => {
    try {
      const shops = await Booking.find();
      res.json(shops);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  module.exports = router;

