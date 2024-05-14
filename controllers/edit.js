// users.js

const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

// Update user profile
router.put('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Update user properties with the data from the request body
      user.name = req.body.name;
      user.email = req.body.email;
      user.username = req.body.username;
      user.address = req.body.address;
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'An error occurred while updating profile' });
    }
  });
  
  module.exports = router;
