const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Add Product
router.post('/', async (req, res) => {
    const { name, price, description, sellerId } = req.body;
    const product = new Product({ name, price, description, sellerId });
    await product.save();
    res.status(201).send('Product added successfully');
});

// Edit Product
router.put('/:id', async (req, res) => {
    const { name, price, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, description });
    res.send('Product updated successfully');
});

// Delete Product
router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.send('Product deleted successfully');
});

// Get All Products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

module.exports = router;
