// Sell Cardamom Backend Route
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CardamomSale = require('../models/CardamomSaleModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/cardamom');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use('/uploads', express.static('uploads'));

router.post('/sell-cardamom', upload.single('image'), async (req, res) => {
  const { priceId, userId, spiceCenterName, name, landownersName, phoneNumber, quantity, date } = req.body;
  const image = req.file.path;

  try {
    // Check if a cardamom sale entry with the same date already exists
    const existingEntry = await CardamomSale.findOne({ userId, date });

    if (existingEntry) {
      return res.status(400).json({ error: 'Data for this date already exists' });
    }

    const newCardamomSale = new CardamomSale({ priceId, userId, spiceCenterName, name, landownersName, phoneNumber, quantity, image, date });
    await newCardamomSale.save();

    console.log('Cardamom sold for price with ID:', priceId);
    console.log('Spice Center Name:', spiceCenterName);
    console.log('Name:', name);
    console.log("Landowner's Name:", landownersName);
    console.log('Phone Number:', phoneNumber);
    console.log('Quantity:', quantity);
    console.log('Image Path:', image);
    console.log('Date:', date);

    res.status(200).json({ message: 'Cardamom sold successfully' });
  } catch (error) {
    console.error('Error selling cardamom:', error);
    res.status(500).json({ error: 'An error occurred while selling cardamom' });
  }
});


router.get('/user-sales/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you're sending the userId as a query parameter
    const sales = await CardamomSale.find({ 'userId':userId });
    console.log(userId)
    res.json(sales);
  } catch (error) {
    console.error('Error fetching cardamom sales:', error);
    res.status(500).json({ error: 'An error occurred while fetching cardamom sales' });
  }
});



module.exports = router;
