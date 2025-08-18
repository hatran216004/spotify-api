const { User } = require('../models');
const { sendSuccess } = require('../utils');
const { getAll, updateOne, deleteOne } = require('./base.controller');
const { catchAsync } = require('../utils');
const { upload } = require('../middleware/fileUpload.middleware');
const { userService } = require('../services');

exports.uploadFilesImg = upload.single('avatarUrl');

exports.getMeTracksLiked = catchAsync(async (req, res, next) => {
  const { likedTracks } = await userService.getMeTracksLiked(
    req.user.id,
    req.query
  );
  sendSuccess(res, { tracks: likedTracks }, 200);
});

exports.addTrackToLiked = catchAsync(async (req, res, next) => {
  const likedTrack = await userService.addTrackToLiked(
    req.user.id,
    req.body.trackId
  );

  sendSuccess(res, { track: likedTrack }, 200);
});

exports.removeTrackFromLiked = catchAsync(async (req, res, next) => {
  await userService.removeTrackFromLiked(req.user.id, req.params.trackId);
  sendSuccess(res, null, 204);
});

exports.getMe = (req, res, next) => {
  sendSuccess(res, { user: req.user }, 200);
};

exports.updateMe = updateOne(User);

exports.getAllUsers = getAll(User);
exports.deleteUser = deleteOne(User);
