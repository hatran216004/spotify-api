const express = require('express');
const {
  createSong,
  uploadSongFiles,
  resizeAndUploadToCloud,
  createArtist,
  createAlbum
} = require('../controllers/admin.controller');

const router = express.Router();

router.post('/song', uploadSongFiles, resizeAndUploadToCloud, createSong);
router.post('/artist', createArtist);
router.post('/album', createAlbum);

module.exports = router;
