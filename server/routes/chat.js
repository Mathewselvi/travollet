const express = require('express');
const router = express.Router();
const { auth, adminAuth: admin } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');


router.get('/my-history', auth, async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.user._id })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/history/:userId', auth, admin, async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.userId })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/conversations/:conversationId/messages', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const conversationId = req.params.conversationId;
        const senderId = req.user._id;

        // Determine if sender is admin based on user role or specific logic
        // Assuming req.user.role is populated by auth middleware, or we check if user is admin
        const isAdmin = req.user.role === 'admin';

        const newMessage = new Message({
            conversationId,
            sender: senderId,
            content,
            isAdmin,
            isRead: false
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});
router.get('/conversations', auth, admin, async (req, res) => {
    try {

        const conversations = await Message.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $first: '$content' },
                    lastMessageDate: { $first: '$createdAt' },
                    unreadCount: {
                        $sum: {
                            $cond: [{ $and: [{ $eq: ['$isRead', false] }, { $eq: ['$isAdmin', false] }] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { lastMessageDate: -1 } }
        ]);


        const populatedConversations = await User.populate(conversations, { path: '_id', select: 'name email' });


        const formatted = populatedConversations.map(conv => {
            // Check if conv._id is still a string (Guest) or an object (User)
            const isGuest = !conv._id.name && !conv._id.email;

            return {
                user: isGuest ? { _id: conv._id, name: `Guest User`, email: 'Visitor' } : conv._id,
                lastMessage: conv.lastMessage,
                lastMessageDate: conv.lastMessageDate,
                unreadCount: conv.unreadCount
            };
        });

        res.json(formatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error check logs' });
    }
});


router.delete('/conversation/:userId', auth, admin, async (req, res) => {
    try {
        await Message.deleteMany({ conversationId: req.params.userId });
        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
