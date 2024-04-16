// routes/addtocart.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/AddtocartModel'); // Adjust the path accordingly
const Product = require('../models/ProductModel'); // Import the Product model



// Route to add an item to the cart
router.post('/add-to-cart/:productId', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);   
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });  
    }

    // Create or find the cart
    let cart = await Cart.findOne();

    if (!cart) {
      cart = new Cart({ items: [] });
    }

    // Check if the product is already in the cart
    const existingItem = cart.items.find((item) => item.product.equals(productId));

    if (existingItem) {
      // If the product is already in the cart, update the quantity
      existingItem.quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/cart/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.product'); // Populate the product details
    res.json(cart || { items: [] }); // Return an empty array if the cart is not found
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.delete('/remove/:productId', async (req, res) => {
  const { productId } = req.params;
  
  console.log('Received DELETE request for productId:', productId);

  try {
    const cart = await Cart.findOne();
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }


    const objectIdProductId = mongoose.Types.ObjectId.createFromHexString(productId);

    // Remove the item from the cart
    cart.items = cart.items.filter(item => !item.product.equals(objectIdProductId));

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.delete('/clear-cart', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Clear all items from the cart
    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
