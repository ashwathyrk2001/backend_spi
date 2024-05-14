const express = require('express');
const router = express.Router();
const DailySlot = require('../models/DailyslotModel');
const Shop = require('../models/ShopModel');

router.post('/dailyslot/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;

    // Check if daily slots already exist for the specified shop
    const existingDailySlots = await DailySlot.find({ shopId });

    if (existingDailySlots.length === 0) {
      // Fetch shop details
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      const currentDate = new Date();
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(currentDate.getDate() + 1);

      const defaultSlots = [];

      for (let i = 1; i < 8; i++) {
        const date = new Date(tomorrow);
        date.setDate(tomorrow.getDate() + i);

        const newDailySlot = new DailySlot({
          shopId,
          date,
          availableSpiceCapacity: shop.spiceCapacity,
          slots: [
            {
              startTime: '09:00 AM',
              endTime: '05:00 PM',
              availableSpiceCapacity: shop.spiceCapacity, // Set initial available capacity for each slot
            },
          ],
        });

        defaultSlots.push(newDailySlot);

        // Save the daily slot to the database
        await newDailySlot.save();
      }

      return res.json(defaultSlots); 
    } else {
      return res.status(400).json({ error: 'Daily slots already exist for this shop' });
    }
  } catch (error) {
    console.error('Error creating default slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.get('/getdailyslot/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const currentDate = new Date();
    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the current week

    let existingSlots = await DailySlot.find({
      shopId,
      date: { $gte: weekStartDate },
    });

    if (existingSlots.length === 0) {
      // If no existing slots, create default slots
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      const defaultSlots = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStartDate);
        date.setDate(weekStartDate.getDate() + i);

        const newDailySlot = new DailySlot({
          shopId,
          date,
          availableSpiceCapacity: shop.spiceCapacity,
          slots: [
            {
              startTime: '09:00 AM',
              endTime: '05:00 PM',
              availableSpiceCapacity: shop.spiceCapacity, // Set initial available capacity for each slot
            },
          ],
        });

        defaultSlots.push(newDailySlot);

        // Save the daily slot to the database
        await newDailySlot.save();
      }

      existingSlots = defaultSlots;
    }
    res.json(existingSlots);
  } catch (error) {
    console.error('Error fetching existing daily slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;

