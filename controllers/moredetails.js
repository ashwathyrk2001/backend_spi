// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');

router.get('/moredetails/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to fetch product details' });
  }
});

module.exports = router;
