const express = require('express');
const { getAllUsers, getMe } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/me', getMe);

module.exports = router;
