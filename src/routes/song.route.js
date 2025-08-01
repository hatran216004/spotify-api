const express = require('express');
const {
  getSong,
  getAllSongs,
  getTrendingSongs,
  getMadeForYouSongs
} = require('../controllers/song.controller');
const lyricsRoutes = require('./lyric.route');

const router = express.Router();
router.use('/:id/lyrics', lyricsRoutes);

router.get('/', getAllSongs);

router.get('/trending', getTrendingSongs);
router.get('/made-for-you', getMadeForYouSongs);

router.get('/:id', getSong);

module.exports = router;
