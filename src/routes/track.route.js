const express = require('express');
const {
  getTrack,
  getAllTracks,
  getTrendingTracks,
  getMadeForYouTracks,
  removeTrackFromLiked,
  addTrackToLiked
} = require('../controllers/track.controller');
const lyricsRoutes = require('./lyric.route');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use('/:id/lyrics', lyricsRoutes);

router.get('/', getAllTracks);
router.get('/trending', getTrendingTracks);
router.get('/recommended', protect, getMadeForYouTracks);

router.get('/:id', getTrack);
router
  .route('/:id/like')
  .post(protect, addTrackToLiked)
  .delete(protect, removeTrackFromLiked);

module.exports = router;
