const express = require('express');
const { callbackSSO } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/callback-sso', callbackSSO);

module.exports = router;
