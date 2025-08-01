const express = require('express');
const { smartSearch } = require('../controllers/search.controller');

const router = express.Router();

router.get('/', smartSearch);

module.exports = router;
