const express = require('express');
const { getAllUsers, getMe } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', getAllUsers);
router.get('/me', protect, getMe);

module.exports = router;
