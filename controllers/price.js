// routes/updatePrice.js

const express = require('express');
const router = express.Router();
const Price = require('../models/PricetoLandModel');

// Route to handle price update

router.post('/update-price', async (req, res) => {
  try {
    const { userId, dealerName, highestPrice, averagePrice, date, spiceCenterName, address } = req.body;

    // Check if a document with the same date already exists for the given user
    const existingPrice = await Price.findOne({ userId, date });

    if (existingPrice) {
      // If a document with the same date already exists, return an error
      return res.status(400).json({ error: 'Data for this date already exists' });
    }

    // Create a new price document
    const newPrice = new Price({
      userId,
      dealerName,
      date,
      highestPrice,
      averagePrice,
      spiceCenterName,
      address // Include address in the document creation
    });

    // Save the new price document to the database
    await newPrice.save();

    res.status(201).json({ message: 'Price updated successfully' });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ error: 'An error occurred while updating the price' });
  }
});



// Route to fetch prices for a specific date
router.get('/prices', async (req, res) => {
  try {
    const { date } = req.query; // Get the date from query parameters
    const prices = await Price.find({ date }); // Fetch prices for the specified date
    res.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'An error occurred while fetching prices' });
  }
});
// routes/updatePrice.js



// Route to handle fetching user details by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the price entry by user ID in the database
    const priceEntry = await Price.findOne({ userId });

    if (!priceEntry) {
      // If no price entry is found for the user, return a 404 error
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract necessary details from the price entry
    const { phoneNumber, spiceCenterName, address } = priceEntry;

    // Send the extracted user details in the response
    res.json({ phoneNumber, spiceCenterName, address });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'An error occurred while fetching user details' });
  }
});

module.exports = router;
