const express = require('express');
const router = express.Router();
const multer = require('multer');
const Dealer = require('../models/DealerModel');
const bodyParser = require('body-parser');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/dealerLicense');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use(bodyParser.json());
router.use('/uploads', express.static('uploads'));

router.post('/dealerreg', upload.single('dealerLicense'), async (req, res) => {
  try {
    const {
      dealerName,
      dealerEmail,
      dealerLocation,
      // Add any additional fields specific to the Dealer model
      // ...
    } = req.body;

    const dealerLicensePath = req.file.path;
    const slicedPath = dealerLicensePath.slice(dealerLicensePath.indexOf('uploads/dealerLicense') + 1);

    const newDealer = new Dealer({
      dealerName,
      dealerLicense: slicedPath,
      dealerEmail,
      dealerLocation,
      // Add any additional fields specific to the Dealer model
      // ...
      approved: false,
    });

    await newDealer.save();

    res.status(201).json({ msg: 'Dealer registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Dealer registration failed' });
  }
});

router.patch('/approvedealer/:dealerId', async (req, res) => {
  try {
    const { dealerId } = req.params;
    const { approved } = req.body;

    const dealer = await Dealer.findById(dealerId);

    if (!dealer) {
      return res.status(404).json({ msg: 'Dealer not found' });
    }

    dealer.approved = approved;
    await dealer.save();

    res.status(200).json({ msg: 'Approval status updated successfully', dealer });
  } catch (error) {
    console.error('Error updating approval status:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


router.get('/dealerview', async (req, res) => {
  try {
    const dealers = await Dealer.find({ approved: true });
    res.status(200).json(dealers);
  } catch (error) {
    console.error('Error fetching dealer data:', error);
    res.status(500).json({ msg: 'Failed to fetch dealer data' });
  }
});

module.exports = router;
