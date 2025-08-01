const express = require('express');
const {
  reorderPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylist,
  deleteSongFromPlaylist
} = require('../controllers/playlist.controller');

const router = express.Router();

router.patch('/:id/reorder', reorderPlaylist);

router.route('/').get(getAllPlaylists).post(createPlaylist);

router.delete('/:id/songs/:songId', deleteSongFromPlaylist);

router
  .route('/:id')
  .get(getPlaylist)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

module.exports = router;
