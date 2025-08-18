const express = require('express');
const {
  getAllArtists,
  getPopularArtists,
  getArtist,
  getArtistPopularTracks,
  followArtist,
  unFollowArtist
} = require('../controllers/artist.controller');
const { protect, optionAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/popular', getPopularArtists);
router.get('/:id/tracks/popular', getArtistPopularTracks);

router.get('/', protect, getAllArtists);
router.get('/:id', optionAuth, getArtist);

// Follow
router.post('/:id/follow', protect, followArtist);
router.delete('/:id/unfollow', protect, unFollowArtist);

module.exports = router;
