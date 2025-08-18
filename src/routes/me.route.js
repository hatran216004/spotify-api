const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getMyPlaylists,
  deletePlaylist,
  updatePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  reorderPlaylist,
  uploadCoverImage,
  createMyPlaylist
} = require('../controllers/playlist.controller');

const {
  getMe,
  updateMe,
  uploadFilesImg,
  getMeTracksLiked,
  addTrackToLiked,
  removeTrackFromLiked
} = require('../controllers/user.controller');
const { resizeAndUploadImg } = require('../middleware/fileUpload.middleware');

const {
  startPlayback,
  getCurrentPlayback,
  pausePlayback,
  repeatPlayback,
  seekPlayback,
  shufflePlayback,
  volumePlayback
} = require('../controllers/player.controller');
const { getFollowedArtists } = require('../controllers/artist.controller');

const router = express.Router();

router.use(protect);

// Playlist
router.route('/playlists').get(getMyPlaylists).post(createMyPlaylist);
router
  .route('/playlists/:id')
  .delete(deletePlaylist)
  .patch(
    uploadCoverImage,
    resizeAndUploadImg('tracks/images', 'coverImage'),
    updatePlaylist
  );

router.patch('/playlists/:id/reorder', reorderPlaylist);
router.patch('/playlists/:id/tracks', addTrackToPlaylist);
router.delete('/playlists/:id/tracks/:trackId', removeTrackFromPlaylist);

// Track
router
  .route('/')
  .get(getMe)
  .patch(uploadFilesImg, resizeAndUploadImg('users', 'avatarUrl'), updateMe);

router.route('/liked-tracks').get(getMeTracksLiked).patch(addTrackToLiked);
router.delete('/liked-tracks/:trackId', removeTrackFromLiked);

// Artist
router.get('/artists/followed', getFollowedArtists);

// Player
router.get('/player', getCurrentPlayback);
router.patch('/player/play', startPlayback);
router.patch('/player/pause', pausePlayback);
router.patch('/player/repeat', repeatPlayback);
router.patch('/player/seek', seekPlayback);
router.patch('/player/volume', volumePlayback);
router.patch('/player/shuffle', shufflePlayback);

module.exports = router;
