const express = require('express');
const router = express.Router();
const { getMenuItems } = require('../controllers/menuController');

// GET /api/menu — public, only available items
router.get('/', getMenuItems);

module.exports = router;
