// routes/updatePrice.js
const express = require('express');
const router = express.Router();
const Price = require('../models/PricetoLandModel');

// Route to handle price update

router.post('/update-price', async (req, res) => {
  try {
    const { userId, dealerName, highestPrice, averagePrice, spiceCenterName, address } = req.body;
    const date = new Date(); // Generate the current date dynamically

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
    const prices = await Price.find(); // Fetch all prices
    res.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'An error occurred while fetching prices' });
  }
});



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
