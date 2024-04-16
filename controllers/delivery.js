// routes/deliveryStatus.js
const express = require('express');
const router = express.Router();
const DeliveryStatus = require('../models/DeliveryStatusModel');


router.get('/:orderId', async (req, res) => {
  try {
    const deliveryStatus = await DeliveryStatus.find({ orderId: req.params.orderId }).sort('date');
    res.json(deliveryStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    let deliveryStatus = await DeliveryStatus.findOne({ orderId });

    if (!deliveryStatus) {
      // If delivery status doesn't exist, create a new one
      deliveryStatus = new DeliveryStatus({
        orderId,
        orderConfirmed: status === 'Order Confirmed',
        shipped: status === 'Shipped',
        delivered: status === 'Delivered'
      });
    } else {
      // If delivery status exists, only update if the status is not already true
      if (status === 'Order Confirmed' && !deliveryStatus.orderConfirmed) {
        deliveryStatus.orderConfirmed = true;
      } else if (status === 'Shipped' && !deliveryStatus.shipped) {
        deliveryStatus.shipped = true;
      } else if (status === 'Delivered' && !deliveryStatus.delivered) {
        deliveryStatus.delivered = true;
      }
    }

    await deliveryStatus.save();

    res.status(200).json({ message: 'Delivery status updated successfully.' });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'An error occurred while updating delivery status.' });
  }
});

module.exports = router;


router.post('/update-order-confirmed/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the delivery status for the provided orderId
      let deliveryStatus = await DeliveryStatus.findOne({ orderId });
  
      if (!deliveryStatus) {
        // If delivery status doesn't exist, create a new one
        deliveryStatus = new DeliveryStatus({
          orderId,
          orderConfirmed: true, // Mark it as "Order Confirmed"
        });
      } else {
        // Update the existing delivery status
        deliveryStatus.orderConfirmed = true;
      }
  
      // Save the updated delivery status
      await deliveryStatus.save();
  
      res.status(200).json({ message: 'Delivery status updated successfully.' });
    } catch (error) {
      console.error('Error updating delivery status:', error);
      res.status(500).json({ error: 'An error occurred while updating delivery status.' });
    }
  });
  

  module.exports = router;

//   // twilioService.js

// const twilio = require('twilio');

// const accountSid = 'ACcf936afdc3e3b91c735ed97337dd2886';
// const authToken = 'ad3de4f42f23443384b679d696921a65';
// const twilioPhoneNumber = '8943595056';

// const client = twilio(accountSid, authToken);

// const sendSMS = async (to, message) => {
//   try {
//     await client.messages.create({
//       body: message,
//       from: twilioPhoneNumber,
//       to: to
//     });
//     console.log('SMS sent successfully');
//     return true; // Return true if SMS sent successfully
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//     return false; // Return false if an error occurred
//   }
// };

// module.exports = { sendSMS };


// Import necessary modules
