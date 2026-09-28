const express = require('express');
const router = express.Router();
const { submitReview, getRecentReviews } = require('../controllers/reviewController');
const { protectCustomer } = require('../middleware/authMiddleware');

// GET /api/reviews — public, powers the landing page Reviews section
router.get('/', getRecentReviews);

// POST /api/reviews — logged-in customer submits a review
router.post('/', protectCustomer, submitReview);

module.exports = router;