const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Message = require('../models/Message'); 

const router = express.Router();


router.get('/messages', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});


router.post('/messages', authMiddleware, async (req, res) => {
    try {
        const newMessage = new Message({
            user: req.user.username,
            text: req.body.text
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
