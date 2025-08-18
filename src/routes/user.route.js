const express = require('express');
// const { getAllUsers, deleteUser } = require('../controllers/user.controller');
const { protect, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, checkRole('admin'));

// router.get('/', getAllUsers);
// router.delete('/:id', deleteUser);

module.exports = router;
