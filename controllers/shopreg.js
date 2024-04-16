const express = require('express');
const router = express.Router();
const multer = require('multer');
const Shop = require('../models/ShopModel');
const bodyParser = require('body-parser');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/shopLicense');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use(bodyParser.json());
router.use('/uploads', express.static('uploads'));

router.post('/shopreg', upload.single('shopLicense'), async (req, res) => {
  try {
    const {
      shopName,
      shopEmail,
      ownerName,
      licenseNumber,
      location,
      address,
      spiceCapacity,
      parchingPrice,
    } = req.body;

    const shopLicensePath = req.file.path;
    const slicedPath = shopLicensePath.slice(shopLicensePath.indexOf('uploads/shopLicense') + 1);

    const newShop = new Shop({
      shopName,
      shopLicense: slicedPath,
      shopEmail,
      ownerName,
      licenseNumber,
      location,
      address,
      spiceCapacity,
      parchingPrice,
      approved: false,
    });

    await newShop.save();

    res.status(201).json({ msg: 'Shop registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Shop registration failed' });
  }
});



router.patch('/approve/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { approved } = req.body;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ msg: 'Shop not found' });
    }

    shop.approved = approved;
    await shop.save();

    res.status(200).json({ msg: 'Approval status updated successfully', shop });
  } catch (error) {
    console.error('Error updating approval status:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


router.get('/shopview', async (req, res) => {
  try {
    const shops = await Shop.find({ approved: true });
    res.status(200).json(shops);
  } catch (error) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ msg: 'Failed to fetch shop data' }); 
  }
});


router.get('/shopviewbyid/:id', async (req, res) => {
  try {
    const shopId = req.params.id;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ msg: 'Shop not found' });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ msg: 'Failed to fetch shop data' });
  }
});


router.get('/shoplocation/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;

    // Check if shopId is valid
    if (!shopId) {
      return res.status(400).json({ error: 'Invalid shop ID' });
    }

    // Fetch only the location of the shop by ID
    const shop = await Shop.findById(shopId, 'location');

    // Check if shop is found
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Respond with the location data
    res.json({ location: shop.location });
  } catch (error) {
    console.error('Error fetching shop location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
