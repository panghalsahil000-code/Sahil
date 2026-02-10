const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create order
router.post('/', async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            user: req.user._id
        });
        
        // Calculate total price
        order.totalPrice = order.itemsPrice + order.taxPrice + order.shippingPrice;
        
        await order.save();
        await order.populate('orderItems.product');
        
        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate('orderItems.product');
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('orderItems.product');
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update order status
router.put('/:id/status', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;