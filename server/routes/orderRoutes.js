const express = require('express');
const router = express.Router();
const { createOrder, getOrderByCode, getMyOrders } = require('../controllers/orderController');
const { protectCustomer } = require('../middleware/authMiddleware');

// POST /api/orders — requires customer login
router.post('/', protectCustomer, createOrder);

// GET /api/orders — logged-in customer's own order history
router.get('/', protectCustomer, getMyOrders);

// GET /api/orders/:orderCode — anyone with the code can check status
router.get('/:orderCode', getOrderByCode);

module.exports = router;
