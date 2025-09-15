const express = require('express');
const {
  updatePlaylist,
  deletePlaylist,
  getPlaylist,
  getAllPlaylists,
  followPlaylist,
  unfollowPlaylist,
  getPopularPlaylists,
  uploadCoverImage
} = require('../controllers/playlist.controller');
const { protect } = require('../middleware/auth.middleware');
const { resizeAndUploadImg } = require('../middleware/fileUpload.middleware');

const router = express.Router();

router.get('/', getAllPlaylists);
router.get('/popular', getPopularPlaylists);

router.use(protect);

router
  .route('/:id')
  .get(getPlaylist)
  .patch(
    uploadCoverImage,
    resizeAndUploadImg('tracks/images', 'coverImage'),
    updatePlaylist
  )
  .delete(deletePlaylist);

router.post('/:id/follow', followPlaylist);
router.delete('/:id/unfollow', unfollowPlaylist);

module.exports = router;
