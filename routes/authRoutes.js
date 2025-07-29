const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, logout } = require('../controller/authController');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

module.exports = router;
