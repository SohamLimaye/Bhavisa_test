// Inside your Express.js app setup

const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Assuming User model is defined

router.post('/user/subscription', async (req, res) => {
    const { userId, subscriptionId } = req.body;

    try {
        // Find the user by ID and update the subscription ID
        const user = await User.findByIdAndUpdate(userId, { subscriptionId: subscriptionId }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User subscription updated successfully" });
    } catch (error) {
        console.error("Error updating user subscription:", error);
        res.status(500).json({ message: "Failed to update user subscription" });
    }
});

module.exports = router;
