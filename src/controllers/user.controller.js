const { User } = require('../models');
const { sendSuccess } = require('../utils');
const { getAll, updateOne } = require('./base.controller');
const { catchAsync } = require('../utils');
const { upload } = require('../middleware/fileUpload.middleware');
const { fileService, userService } = require('../services');

exports.uploadFilesImg = upload.single('avatarUrl');

exports.resizeAndUploadImg = catchAsync(async (req, res, next) => {
  const file = req.file;

  if (file) {
    const buffer = await fileService.resizeImage(file);
    const avatarUrl = await fileService.uploadToCloudinary({
      buffer,
      folderToUpload: 'users'
    });
    req.body.avatarUrl = avatarUrl;
  }

  next();
});

exports.getAllUsers = getAll(User);

exports.updateMe = updateOne(User);

exports.getMe = (req, res, next) => {
  sendSuccess(res, { user: req.user }, 200);
};

exports.getMeSongsLiked = catchAsync(async (req, res, next) => {
  const { currentPage, likedSongs, pageCount } =
    await userService.getMeSongsLiked(req.user.id, req.query);
  sendSuccess(
    res,
    { songs: likedSongs, pagination: { currentPage, pageCount } },
    200
  );
});

exports.addSongToLiked = catchAsync(async (req, res, next) => {
  const likedSong = await userService.addSongToLiked(
    req.user.id,
    req.params.songId
  );

  sendSuccess(res, { song: likedSong }, 200);
});

exports.removeSongFromLiked = catchAsync(async (req, res, next) => {
  await userService.removeSongFromLiked(req.user.id, req.params.songId);
  sendSuccess(res, null, 204);
});
