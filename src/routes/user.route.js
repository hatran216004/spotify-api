const express = require('express');
const {
  getAllUsers,
  getMe,
  updateMe,
  resizeAndUploadImg,
  uploadFilesImg,
  getMeSongsLiked,
  addSongToLiked,
  removeSongFromLiked
} = require('../controllers/user.controller');
const { User } = require('../models');

const router = express.Router();

router.use(async (req, res, next) => {
  const user = await User.findById('688cd7369c8355aac33a8e75');
  req.user = user;
  next();
});

router.get('/', getAllUsers);
router
  .route('/me')
  .get(getMe)
  .patch(uploadFilesImg, resizeAndUploadImg, updateMe);

router.get('/me/liked-songs', getMeSongsLiked);
router
  .route('/me/liked-songs/:songId')
  .patch(addSongToLiked)
  .delete(removeSongFromLiked);

module.exports = router;
