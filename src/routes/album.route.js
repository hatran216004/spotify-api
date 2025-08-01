const express = require('express');
const { getAlbum, getAllAlbums } = require('../controllers/album.controller');

const router = express.Router();

router.get('/:id', getAlbum);
router.get('/', getAllAlbums);

module.exports = router;
