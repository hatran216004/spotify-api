const express = require('express');
const { getTrackLyrics } = require('../controllers/lyric.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/', getTrackLyrics);

module.exports = router;
