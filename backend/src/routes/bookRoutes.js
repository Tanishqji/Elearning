const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Check Book Access
router.get('/access', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user.isSubscribed) {
            return res.status(200).json({ hasAccess: true, message: 'Subscribed user access granted' });
        }

        const now = new Date();
        if (now < new Date(user.trialExpiresAt)) {
            return res.status(200).json({ hasAccess: true, message: 'Free trial access granted' });
        }

        // Trial expired and not subscribed
        return res.status(403).json({ hasAccess: false, message: 'Trial expired. Please buy a subscription.' });

    } catch (error) {
         res.status(500).json({ error: 'Failed to verify access' });
    }
});

module.exports = router;
