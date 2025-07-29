const express = require('express');
const { getAllusers, getMe } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllusers);
router.get('/me', protect, getMe);

module.exports = router;
