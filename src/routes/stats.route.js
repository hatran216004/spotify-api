const express = require('express');
const { getStats } = require('../controllers/stat.controller');

const router = express.Router();

router.get('/', getStats);

module.exports = router;
