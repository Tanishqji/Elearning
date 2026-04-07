const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { authMiddleware } = require('../middlewares/authMiddleware');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Create Order
router.post('/create-order', authMiddleware, async (req, res) => {
    try {
        const options = {
            amount: 299 * 100, // 299 INR
            currency: 'INR',
            receipt: `receipt_order_${req.user._id}`,
        };

        const order = await razorpay.orders.create(options);
        if (!order) return res.status(500).send('Some error occurred');

        res.status(200).json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Verify Payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Update user to subscribed
            await User.findByIdAndUpdate(req.user._id, { isSubscribed: true });
            return res.status(200).json({ message: 'Payment verified successfully. Subscription activated.' });
        } else {
            return res.status(400).json({ message: 'Invalid signature sent!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error!' });
    }
});

module.exports = router;
