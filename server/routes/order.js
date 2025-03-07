const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
    const { userId, products, totalAmount } = req.body;
    const order = new Order({ userId, products, totalAmount });
    await order.save();
    res.status(201).send('Order created successfully');
});

// Get User Orders
router.get('/:userId', async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId }).populate('products.productId');
    res.json(orders);
});

module.exports = router;
