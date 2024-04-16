const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/BookingModel');
const DailySlot = require('../models/DailyslotModel');


router.post('/bookslot/:shopId', async (req, res) => {
  const { shopId } = req.params; // Extract shopId from req.params
  console.log("shopid",shopId); 

  try {
    const {
      userId,
      name,
      deliveryAddress, // Update to access deliveryAddress object directly
      phoneNumber,
      bookingAmount,
      bookingAmountUnit,
      bookingDate,
      bookingTime,
    } = req.body;

    console.log("bookingdetails", userId,
      name,
      deliveryAddress, // Use deliveryAddress directly
      phoneNumber,
      bookingAmount,
      bookingAmountUnit,
      bookingDate,
      bookingTime);

    // Fetch corresponding DailySlot for the given shopId and bookingDate
    const dailySlot = await DailySlot.findOne({
      shopId: shopId, // Use the extracted shopId here
      date: bookingDate,
    });

    // Handle case when DailySlot is not found
    if (!dailySlot) {
      return res.status(404).json({ error: 'DailySlot not found' });
    }
    const spiceReduction = bookingAmountUnit === 'kg' ? bookingAmount : bookingAmount / 1000;
    dailySlot.availableSpiceCapacity -= bookingAmount;
    await dailySlot.save();


    const newBooking = new Booking({
      userId,
      name,
      deliveryAddress, 
      phoneNumber,
      bookingAmount,
      bookingAmountUnit,
      bookingDate,
      bookingTime,
    });

    const savedBooking = await newBooking.save();

    // Return the updated dailySlot in the response
    res.json({ booking: savedBooking, updatedDailySlot: dailySlot });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.patch('/bookingsold/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log(bookingId);
    const { sold } = req.body;

    console.log('Received request to update bookingId:', bookingId, 'with sold:', sold);

    // Validate if bookingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid bookingId' });
    }

    // Update the 'sold' property in the database using findOneAndUpdate
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: { sold } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Updated Booking:', updatedBooking);
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating sold status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/dailyslot/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { date, spiceCapacity } = req.body;

    const newDailySlot = new DailySlot({
      shopId,
      date,
      spiceCapacity,
    });

    await newDailySlot.save();
    res.json(newDailySlot);
  } catch (error) {
    console.error('Error creating daily slot:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;