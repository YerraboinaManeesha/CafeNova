const express = require('express');
const router = express.Router();
const { unifiedLogin } = require('../controllers/authController');

router.post('/', unifiedLogin);

module.exports = router;