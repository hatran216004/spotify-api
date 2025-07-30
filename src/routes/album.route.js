const express = require('express');
const { getAlbum } = require('../controllers/album.controller');

const router = express.Router();

router.get('/:id', getAlbum);

module.exports = router;
