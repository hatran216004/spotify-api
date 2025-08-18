const express = require('express');
const {
  callbackLogin,
  callbackRegister
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/callback-register', callbackRegister);
router.post('/callback-login', callbackLogin);

module.exports = router;
