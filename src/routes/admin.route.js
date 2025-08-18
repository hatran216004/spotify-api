const express = require('express');

const {
  createTrack,
  uploadTrackFiles,
  resizeAndUploadTrackImg,
  uploadTrackAudio,
  updateTrack,
  deleteTrack,
  parseLyricsContent
} = require('../controllers/track.controller');

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
const { protect, checkRole } = require('../middleware/auth.middleware');
const { getAllUsers, deleteUser } = require('../controllers/user.controller');

const router = express.Router();

// router.use(protect, checkRole('admin'));

router.post(
  '/tracks',
  uploadTrackFiles,
  resizeAndUploadTrackImg,
  uploadTrackAudio,
  parseLyricsContent,
  createTrack
);
router
  .route('/tracks/:id')
  .patch(uploadTrackFiles, resizeAndUploadTrackImg, updateTrack)
  .delete(deleteTrack);

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

// User
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
