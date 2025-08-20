const express = require('express');
const {
  callbackLogin,
  callbackRegister,
  callbackSSO
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/callback-sso', callbackSSO);
router.post('/callback-register', callbackRegister);
router.post('/callback-login', callbackLogin);

module.exports = router;
