const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/ProductModel');
const bodyParser = require('body-parser');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use(bodyParser.json());
router.use('/uploads', express.static('uploads'));

// Route for adding a product with image upload
router.post('/products', upload.single('productImage'), async (req, res) => {
  const { productName, provider, price, description} = req.body; // Include quantity here
  const productImage = req.file.path;
  const slicedPath = productImage.slice(productImage.indexOf('\\') + 1);
  console.log(slicedPath);


  try {
    // Create a new product instance
    const newProduct = new Product({ productImage:slicedPath, productName, provider, price, description });
    
    // Save the product to the database
    await newProduct.save();

    res.status(201).json({ msg: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to add product' });
  }
});

module.exports = router;
