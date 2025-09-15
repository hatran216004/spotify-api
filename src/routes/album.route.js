const express = require('express');
const {
  getAlbum,
  getAllAlbums,
  getPopularAlbums,
  followAlbum,
  unfollowAlbum
} = require('../controllers/album.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/popular', getPopularAlbums);

router.get('/:id', getAlbum);

router.post('/:id/follow', protect, followAlbum);
router.delete('/:id/unfollow', protect, unfollowAlbum);

router.get('/', getAllAlbums);

module.exports = router;
