const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const Payment = require('../models/PaymentModel');

router.post('/order/:productId', async (req, res) => {
  const { totalAmount, orderItems, deliveryAddress, phoneNumber } = req.body; // Add phoneNumber to destructure
  const { userId, userName } = orderItems[0];
  const productId = req.params.productId;

  try {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error('Invalid order items provided.');
    }

    const newOrder = new Order({ totalAmount, userId, userName,deliveryAddress, phoneNumber }); // Include deliveryAddress
  

    const mappedOrderItems = orderItems.map(item => ({
      userName: item.userName,
      userId: item.userId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      productName: item.productName
    }));

    newOrder.items = mappedOrderItems;

    const product = await Product.findById(productId);

    if (!Array.isArray(mappedOrderItems) || mappedOrderItems.length === 0) {
      throw new Error('Items array is empty or not iterable.');
    }

    mappedOrderItems.forEach(item => {
      if (!item.productId) {
        throw new Error('ProductId is required for each item.');
      }
      product.stock -= item.quantity;
    });

    await product.save();
    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

module.exports = router;


router.get('/ordering/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ 'items.userId': userId }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get product stock by ID
router.get('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId; // Extract productId from URL parameters

    // Find the product by ID and project only the stock field
    const product = await Product.findById(productId, 'stock');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ stock: product.stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/current/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;





