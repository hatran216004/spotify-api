const express = require('express');

const {
  createSong,
  uploadSongFiles,
  resizeAndUploadSongImg,
  uploadSongAudio,
  updateSong,
  deleteSong,
  parseLyricsContent
} = require('../controllers/song.controller');

const {
  createArtist,
  deleteArtist,
  updateArtist
} = require('../controllers/artist.controller');

const {
  createAlbum,
  updateAlbum,
  deleteAlbum,
  uploadAlbumCoverImg,
  resizeAndUploadAlbumImg
} = require('../controllers/album.controller');

const router = express.Router();

router.post(
  '/songs',
  uploadSongFiles,
  resizeAndUploadSongImg,
  uploadSongAudio,
  parseLyricsContent,
  createSong
);
router.route('/songs/:id').patch(updateSong).delete(deleteSong);

router.post('/artists', createArtist);
router.route('/artists/:id').patch(updateArtist).delete(deleteArtist);

router.post('/albums', createAlbum);
router
  .route('/albums/:id')
  .patch(uploadAlbumCoverImg, resizeAndUploadAlbumImg, updateAlbum)
  .delete(deleteAlbum);

module.exports = router;
