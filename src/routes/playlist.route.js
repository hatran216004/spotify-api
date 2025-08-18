const express = require('express');
const {
  updatePlaylist,
  deletePlaylist,
  getPlaylist,
  getAllPlaylists
} = require('../controllers/playlist.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getAllPlaylists);
router
  .route('/:id')
  .get(getPlaylist)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

module.exports = router;
