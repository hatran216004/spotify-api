const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getPlaylistUserLibrary,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  reorderPlaylist,
  createMyPlaylist
} = require('../controllers/playlist.controller');

const {
  getMe,
  updateMe,
  uploadFilesImg
} = require('../controllers/user.controller');
const { resizeAndUploadImg } = require('../middleware/fileUpload.middleware');

const {
  startPlayback,
  getCurrentPlayback,
  pausePlayback,
  repeatPlayback,
  seekPlayback,
  shufflePlayback,
  volumePlayback,
  getPlaybackContext
} = require('../controllers/player.controller');
const { getFollowedArtists } = require('../controllers/artist.controller');
const { getMeTracksLiked } = require('../controllers/track.controller');

const { getUserFollowAlbums } = require('../controllers/album.controller');

const router = express.Router();

router.use(protect);

// Track
router
  .route('/')
  .get(getMe)
  .patch(uploadFilesImg, resizeAndUploadImg('users', 'avatarUrl'), updateMe);

router.get('/tracks/liked', getMeTracksLiked);

// Playlist
router.route('/playlists').get(getPlaylistUserLibrary).post(createMyPlaylist);
router.route('/playlists/:id').delete(deletePlaylist);

router.patch('/playlists/:id/reorder', reorderPlaylist);
router.patch('/playlists/:id/tracks', addTrackToPlaylist);
router.delete('/playlists/:id/tracks/:trackId', removeTrackFromPlaylist);

// Albums
router.get('/albums', getUserFollowAlbums);

// Artist
router.get('/artists/followed', getFollowedArtists);

// Player
router.get('/player', getCurrentPlayback);
router.get('/player/context/:id/:type', getPlaybackContext);
router.patch('/player/play', startPlayback);
router.patch('/player/pause', pausePlayback);
router.patch('/player/repeat', repeatPlayback);
router.patch('/player/seek', seekPlayback);
router.patch('/player/volume', volumePlayback);
router.patch('/player/shuffle', shufflePlayback);

// Context

module.exports = router;
