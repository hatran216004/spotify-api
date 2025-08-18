const express = require('express');
const {
  getAlbum,
  getAllAlbums,
  getPopularAlbums
} = require('../controllers/album.controller');

const router = express.Router();

router.get('/popular', getPopularAlbums);

router.get('/:id', getAlbum);
router.get('/', getAllAlbums);

module.exports = router;
