const express = require('express');
const { getAllUsers, getMe } = require('../controllers/user.controller');
const { protect, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/me', protect, checkRole('admin'), getMe);

module.exports = router;
