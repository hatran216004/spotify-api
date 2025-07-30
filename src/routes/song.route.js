const express = require('express');
const { getSong } = require('../controllers/song.controller');
const lyricsRoutes = require('./lyric.route');

const router = express.Router();
router.use('/:id/lyrics', lyricsRoutes);

router.get('/:id', getSong);

module.exports = router;
