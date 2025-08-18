const express = require('express');
const { getStats } = require('../controllers/stat.controller');
const { protect, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, checkRole('admin'));

router.get('/', getStats);

module.exports = router;
