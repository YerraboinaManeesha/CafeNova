const express = require('express');
const router = express.Router();
const { sendMessage, getMyConversation, getMyUnreadCount, clearMyConversation } = require('../controllers/contactController');
const { protectCustomer } = require('../middleware/authMiddleware');

// POST /api/contact — logged-in customer sends a message (joins their one conversation)
router.post('/', protectCustomer, sendMessage);

// GET /api/contact/mine — the customer's full conversation; marks admin replies as read
router.get('/mine', protectCustomer, getMyConversation);

// DELETE /api/contact/mine — permanently clears the customer's own conversation
router.delete('/mine', protectCustomer, clearMyConversation);

// GET /api/contact/unread-count — read-only peek for the profile icon badge
router.get('/unread-count', protectCustomer, getMyUnreadCount);

module.exports = router;