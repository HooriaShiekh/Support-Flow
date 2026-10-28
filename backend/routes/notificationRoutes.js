const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const verifyToken = require('../middleware/verifyToken'); // Aapka auth middleware


// 1. Logged-in customer ki notifications fetch karne ke liye
router.get('/my-notifications', verifyToken, async (req, res) => {
    try {
        // Yahan req.user.id ya req.user._id jo aapke auth middleware mein use hota ho
        const userId = req.user.id || req.user._id;
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// 2. Notification ko 'read' mark karne ke liye
router.put('/mark-read/:id', verifyToken, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

module.exports = router;