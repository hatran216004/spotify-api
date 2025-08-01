const express = require('express');
const {
  reorderPlaylist,
  createPlaylist
} = require('../controllers/playlist.controller');

const router = express.Router();

router.patch('/:id/reorder', reorderPlaylist);
router.post('/', createPlaylist);

module.exports = router;
