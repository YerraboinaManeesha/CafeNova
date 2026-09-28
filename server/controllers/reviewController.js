const Review = require('../models/Review');

// @route  POST /api/reviews
// @access Private (logged-in customer)
const submitReview = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const numRating = Number(rating);

    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Please select a rating between 1 and 5 stars' });
    }
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ message: 'Please write your feedback before submitting' });
    }

    const saved = await Review.create({
      customer: req.customer._id,
      customerName: req.customer.name,
      rating: numRating,
      feedback: feedback.trim(),
    });

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/reviews
// @access Public
// Powers the landing page — latest reviews, newest first. Defaults to 3.
const getRecentReviews = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 3, 50);
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(limit);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/reviews
// @access Private (admin) — every review, newest first, no limit
const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/admin/reviews/:id
// @access Private (admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitReview, getRecentReviews, getAllReviewsAdmin, deleteReview };