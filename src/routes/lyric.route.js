const express = require('express');
const { getSongLyrics } = require('../controllers/lyric.controller');

const router = express.Router({ mergeParams: true });

router.get('/', getSongLyrics);

module.exports = router;
