// routes/productview.js
const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');
const path = require("path")

router.get('/productview', async (req, res) => {
  try {
    const products = await Product.find({}, 'productImage productName provider price').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ msg: 'Failed to fetch products' });
  }
});

router.use('/uploads', express.static(path.join(__dirname, '/uploads')));

router.get('/get-product-image/:filename', (req, res) => {
  
  const { filename } = req.params;
  

  const filepath = path.join(__dirname, '../uploads', filename);
  // Add logic to send the file as a response
  res.sendFile(filepath);
});
module.exports = router;
