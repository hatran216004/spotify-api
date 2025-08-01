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
  updateArtist,
  resizeAndUploadImg,
  uploadFilesImg
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

router.post('/artists', uploadFilesImg, resizeAndUploadImg, createArtist);
router
  .route('/artists/:id')
  .patch(uploadFilesImg, resizeAndUploadImg, updateArtist)
  .delete(deleteArtist);

router.post('/albums', createAlbum);
router
  .route('/albums/:id')
  .patch(uploadAlbumCoverImg, resizeAndUploadAlbumImg, updateAlbum)
  .delete(deleteAlbum);

module.exports = router;
