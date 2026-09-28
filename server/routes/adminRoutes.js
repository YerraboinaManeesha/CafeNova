const express = require('express');
const router = express.Router();

const { loginAdmin, getAdminProfile } = require('../controllers/adminController');
const {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItemsAdmin,
} = require('../controllers/menuController');
const { getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const {
  getConversationsList,
  getConversationByCustomer,
  replyToCustomer,
  deleteConversation,
} = require('../controllers/contactController');
const { getAllReviewsAdmin, deleteReview } = require('../controllers/reviewController');
const { protectAdmin } = require('../middleware/authMiddleware');

// --- Auth ---
router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminProfile);

// --- Menu management (protected) ---
router.get('/menu', protectAdmin, getAllMenuItemsAdmin);
router.post('/menu', protectAdmin, createMenuItem);
router.put('/menu/:id', protectAdmin, updateMenuItem);
router.delete('/menu/:id', protectAdmin, deleteMenuItem);

// --- Order management (protected) ---
router.get('/orders', protectAdmin, getAllOrders);
router.put('/orders/:id/status', protectAdmin, updateOrderStatus);
router.delete('/orders/:id', protectAdmin, deleteOrder);

// --- Customer conversations (protected) ---
router.get('/messages', protectAdmin, getConversationsList);
router.get('/messages/:customerId', protectAdmin, getConversationByCustomer);
router.post('/messages/:customerId/reply', protectAdmin, replyToCustomer);
router.delete('/messages/:customerId', protectAdmin, deleteConversation);

// --- Reviews (protected) ---
router.get('/reviews', protectAdmin, getAllReviewsAdmin);
router.delete('/reviews/:id', protectAdmin, deleteReview);

module.exports = router;